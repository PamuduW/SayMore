from fastapi import FastAPI, UploadFile, File, HTTPException
import uvicorn
import tempfile
import speech_recognition as sr
from openai import AzureOpenAI
from pydantic_settings import SettingsConfigDict, BaseSettings
from pydantic import BaseModel
import json


class Config(BaseSettings):
    AZURE_OPENAI_API_KEY: str
    AZURE_OPENAI_DEPLOYMENT_ID: str
    AZURE_ENDPOINT: str

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


config = Config()

openai_client = AzureOpenAI(
    api_key=config.AZURE_OPENAI_API_KEY,
    api_version="2024-05-01-preview",
    azure_endpoint=config.AZURE_ENDPOINT,
)

app = FastAPI()


class StutterAnalysisResponse(BaseModel):
    language: str
    stutter_count: int
    stuttered_words: list
    cluttering_detected: bool
    fluency_score: int
    confidence_score: float


@app.post("/analyze-audio", response_model=StutterAnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    if file.content_type != "audio/wav":
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .wav file.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        tmp_file.write(await file.read())
        tmp_file_path = tmp_file.name

    recognizer = sr.Recognizer()
    with sr.AudioFile(tmp_file_path) as source:
        audio_data = recognizer.record(source)
        try:
            transcript = recognizer.recognize_google(audio_data)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error transcribing audio: {e}")

    system_prompt = """
    "You are an expert in speech and language pathology specializing in stuttering detection. "
        "You will be provided with a transcript of a spoken audio file in any language. Your task is to analyze the transcript to detect signs of stuttering, "
        "including clinical stuttering patterns such as sound repetitions, syllable repetitions, word repetitions, prolongations, and blocks (silent pauses within words). "
        "Additionally, identify signs of cluttering (excessively fast or irregular speech) if present. Use linguistic analysis and natural language processing to detect and classify stuttering patterns. "
        "Along with the stuttering and cluttering analysis, you should also detect the language of the transcript."

        "Return the result in JSON format with the following keys:"

        "'language': The detected language of the transcript (e.g., English, Spanish, etc.)."
        "'stutter_count': The total number of stutters detected."
        "'stuttered_words': A list of words or phrases that were stuttered, along with the type of stutter (e.g., repetition, prolongation, block)."
        "'cluttering_detected': A boolean value (true/false) indicating if signs of cluttering were found."
        "'fluency_score': A numerical score (0-100) representing the speech fluency, where higher values indicate better fluency."
        "'confidence_score': A numerical value (0-1) representing the confidence level of the stuttering detection analysis, where 1 indicates the highest certainty."
        "Ensure accuracy by considering linguistic context, phonetic patterns, and typical speech disfluencies. Provide an unbiased and objective analysis."
    """

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": transcript},
    ]

    try:
        response = openai_client.chat.completions.create(
            model=config.AZURE_OPENAI_DEPLOYMENT_ID,
            messages=messages,
            max_tokens=150
        )
        gpt_response = response.choices[0].message.content.strip()
        gpt_response = gpt_response.replace("```json", "").replace("```", "").strip()
        return json.loads(gpt_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing GPT response: {e}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
