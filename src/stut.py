import json
import os

import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

asure_speech_key = os.getenv("asure_speech_key")
asure_speech_region = os.getenv("asure_speech_region")

google_api_key = os.getenv("google_api_key")

genai.configure(api_key=google_api_key)
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
    speech_config = speechsdk.SpeechConfig(subscription=asure_speech_key, region=asure_speech_region)
    audio_config = speechsdk.audio.AudioConfig(filename=file_name)

    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    result = recognizer.recognize_once()

    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text
    else:
        return None

def analyze_stuttering_gemini(transcript):
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
            return {"error": "Google Generative AI API returned an empty or invalid response."}
    except Exception as e:
        print(f"Error during Google Generative AI API call: {e}")
        return {"error": str(e)}


def stutter_test(file_name):
    try:
        transcript = transcribe_audio(file_name)
        print("Transcript:", transcript)
        if not transcript:
            return {"error": "Error transcribing audio."}

        analysis_result = analyze_stuttering_gemini(transcript)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}
