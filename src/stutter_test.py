import json
import os

from openai import AzureOpenAI
import speech_recognition as sr


class Config:
    AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_DEPLOYMENT_ID = os.getenv("AZURE_OPENAI_DEPLOYMENT_ID")
    AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")


config = Config()

openai_client = AzureOpenAI(
    api_key=config.AZURE_OPENAI_API_KEY,
    api_version="2024-05-01-preview",
    azure_endpoint=config.AZURE_ENDPOINT,
)


def stutter_test(file_name):
    """Analyzes an audio file for stuttering patterns.

    Parameters
    ----------
    file_name (str): The name of the audio file to be analyzed.

    Returns
    -------
    dict: Analysis result containing language, stutter count, stuttered words, cluttering detection, fluency score, and confidence score.

    """
    try:
        recognizer = sr.Recognizer()
        with sr.AudioFile(file_name) as source:
            audio_data = recognizer.record(source)
            try:
                transcript = recognizer.recognize_google(audio_data)
            except Exception as e:
                return {"error": f"Error transcribing audio: {e}"}

        system_prompt = """
        "You are an expert in speech and language pathology specializing in stuttering detection. "
            "Analyze the transcript to detect stuttering patterns, including repetitions, prolongations, blocks, and cluttering. "
            "Identify the language and provide an unbiased analysis in JSON format."

            "Return JSON with:"
            "'language': Detected language.
            "'stutter_count': Total detected stutters.
            "'stuttered_words': List of stuttered words and their types.
            "'cluttering_detected': Boolean for cluttering detection.
            "'fluency_score': Fluency score (0-100).
            "'confidence_score': Confidence level (0-1)."
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": transcript},
        ]

        response = openai_client.chat.completions.create(
            model=config.AZURE_OPENAI_DEPLOYMENT_ID,
            messages=messages,
            max_tokens=150
        )

        gpt_response = response.choices[0].message.content.strip()
        gpt_response = gpt_response.replace("```json", "").replace("```", "").strip()

        return json.loads(gpt_response)

    except Exception as e:
        return {"error": f"Error processing stutter test: {e}"}
