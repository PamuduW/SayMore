import json
import os

import azure.cognitiveservices.speech as speechsdk
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Retrieve Azure Speech API key and region from environment variables
azure_speech_key = os.getenv("AZURE_SPEECH_KEY")
azure_speech_region = os.getenv("AZURE_SPEECH_REGION")

# Retrieve Google API key from environment variables
google_api_key = os.getenv("GOOGLE_API_KEY")

# Configure the Google Generative AI model with the API key
genai.configure(api_key=google_api_key)
model = genai.GenerativeModel("gemini-2.0-flash")

# System prompt for the generative model to analyze stuttering in transcripts
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


def transcribe_audio(file_name, language):
    """Transcribe audio from a file using Azure Cognitive Services Speech SDK.

    Args:
        file_name (str): The path to the audio file.
        language (str): The BCP-47 language code (default "en-US").

    Returns:
        str: The transcribed text if successful, None otherwise.
    """
    speech_config = speechsdk.SpeechConfig(subscription=azure_speech_key, region=azure_speech_region)
    speech_config.speech_recognition_language = language
    audio_config = speechsdk.audio.AudioConfig(filename=file_name)

    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    result = recognizer.recognize_once()

    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text
    else:
        return None


def analyze_stuttering_gemini(transcript):
    """Analyze a transcript for stuttering patterns using the Google Generative AI model.

    Args:
        transcript (str): The transcript text to be analyzed.

    Returns:
        dict: A dictionary containing the analysis results or an error message.

    """
    try:
        prompt = system_prompt + "\n\nTranscript:\n" + transcript

        response = model.generate_content(prompt)

        if response and response.text:
            cleaned_text = response.text.strip()
            if cleaned_text.startswith("```"):
                cleaned_text = "\n".join(cleaned_text.splitlines()[1:-1]).strip()
            try:
                return json.loads(cleaned_text)
            except json.JSONDecodeError:
                print("Gemini's response was not valid JSON. Returning raw text.")
                return {"raw_response": cleaned_text}
        else:
            print("Google Generative AI API returned an empty or invalid response.")
            return {
                "error": "Google Generative AI API returned an empty or invalid response."
            }
    except Exception as e:
        print(f"Error during Google Generative AI API call: {e}")
        return {"error": str(e)}


def stutter_test(file_name, lan_flag):
    """Perform a stuttering analysis on an audio file.

    Args:
        file_name (str): The path to the audio file to be analyzed.
        language (str): The language code for transcription.

    Returns:
        dict: A dictionary containing the analysis results or an error message.
    """
    try:
        language_mapping = {"en": "en-US", "si": "si-LK", "ta": "ta-LK"}
        language_code = language_mapping.get(lan_flag, "en-US")

        transcript = transcribe_audio(file_name, language_code)
        if not transcript:
            return {"error": "Error transcribing audio."}

        analysis_result = analyze_stuttering_gemini(transcript)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}
