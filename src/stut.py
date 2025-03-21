import os
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

# Azure Speech-to-Text Credentials
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")

# Google AI Studio API Credentials
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure the Google generative AI library with your API key
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

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
    """Convert speech to text using Azure Speech-to-Text."""
    speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    audio_config = speechsdk.audio.AudioConfig(filename=file_name)

    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    result = recognizer.recognize_once()

    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text
    else:
        return None

def analyze_stuttering_gemini(transcript):
    """
    Analyzes the transcript for stuttering using the Google Generative AI model.

    Args:
        transcript: The transcribed text to analyze.

    Returns:
        A dictionary containing the analysis results.
    """
    try:
        prompt = system_prompt + "\n\nTranscript:\n" + transcript

        # Call the Google Generative AI API using the selected model
        response = model.generate_content(prompt)

        if response and response.text:
            # Remove markdown code fences (```) if present
            cleaned_text = response.text.strip()
            if cleaned_text.startswith("```"):
                # Remove first line (e.g., "```json") and last line ("```")
                cleaned_text = "\n".join(cleaned_text.splitlines()[1:-1]).strip()
            try:
                return json.loads(cleaned_text)
            except json.JSONDecodeError:
                print("Gemini's response was not valid JSON. Returning raw text.")
                return {"raw_response": cleaned_text}
        else:
            print("Google Generative AI API returned an empty or invalid response.")
            return {"error": "Google Generative AI API returned an empty or invalid response."}
    except Exception as e:
        print(f"Error during Google Generative AI API call: {e}")
        return {"error": str(e)}


def stutter_test(file_name):
    """Run speech-to-text and stuttering analysis."""
    try:
        transcript = transcribe_audio(file_name)
        print("Transcript:", transcript)
        if not transcript:
            return {"error": "Error transcribing audio."}

        analysis_result = analyze_stuttering_gemini(transcript)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}
