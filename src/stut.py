import os
import azure.cognitiveservices.speech as speechsdk
import openai  # Correct import for Azure OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Print API key for debugging (REMOVE in production)
print("Azure OpenAI Key:", os.getenv("AZURE_OPENAI_KEY"))
print("Azure OpenAI Key:", os.getenv("AZURE_OPENAI_ENDPOINT"))

# Azure Speech-to-Text Credentials
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")

# Azure OpenAI API Credentials
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")

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

def transcribe_audio(file_name):
    """ Convert speech to text using Azure Speech-to-Text. """
    speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    audio_config = speechsdk.audio.AudioConfig(filename=file_name)

    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    result = recognizer.recognize_once()

    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text
    else:
        return None

def analyze_stuttering(transcript):
    """ Analyze stuttering using Azure OpenAI GPT-4-Turbo. """
    client = openai.AzureOpenAI(
        api_key=AZURE_OPENAI_KEY,
        api_version="2023-12-01-preview",
        azure_endpoint=AZURE_OPENAI_ENDPOINT
    )

    response = client.chat.completions.create(
        model=AZURE_OPENAI_DEPLOYMENT,  # Use your deployment name
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": transcript}
        ]
    )

    return response.choices[0].message.content

def stutter_test(file_name):
    """ Run speech-to-text and stuttering analysis. """
    try:
        transcript = transcribe_audio(file_name)
        print(transcript)
        if not transcript:
            return {"error": "Error transcribing audio."}

        analysis_result = analyze_stuttering(transcript)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}
