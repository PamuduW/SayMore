import google.generativeai as genai
import speech_recognition as sr
import os
from dotenv import load_dotenv
import tempfile

# Load API key from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini AI
genai.configure(api_key=GEMINI_API_KEY)

def transcribe_audio(file_path):
    """Transcribes an audio file using Google Speech Recognition."""
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio_data = recognizer.record(source)
        try:
            return recognizer.recognize_google(audio_data)
        except Exception as e:
            print(f"Error transcribing audio: {e}")
            return ""

def analyze_stuttering(transcript):
    """Sends the transcript to Gemini AI for stuttering analysis."""
    if not transcript:
        return "No transcript available."

    system_prompt = (
        "You are an expert in speech and language pathology specializing in stuttering detection. "
        "You will be provided with a transcript of a spoken audio file. Your task is to analyze the transcript "
        "to detect signs of stuttering, including clinical stuttering patterns such as sound repetitions, syllable repetitions, "
        "word repetitions, prolongations, and blocks (silent pauses within words). Additionally, identify signs of cluttering "
        "(excessively fast or irregular speech) if present. Use linguistic analysis to detect and classify stuttering patterns. "
        "Also, determine the language of the transcript. "
        "Return the result in JSON format with these keys: "
        "'language': Detected language, "
        "'stutter_count': Total number of stutters detected, "
        "'stuttered_words': List of words/phrases that were stuttered with type, "
        "'cluttering_detected': Boolean (true/false), "
        "'fluency_score': Score (0-100) for speech fluency, "
        "'confidence_score': Score (0-1) for analysis certainty."
    )

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content([system_prompt, transcript])
        return response.text
    except Exception as e:
        return f"Error processing Gemini response: {e}"

if __name__ == "__main__":
    file_path = input("Enter the path to your WAV file: ").strip()

    if not os.path.exists(file_path):
        print("Error: File not found.")
    else:
        print("Transcribing audio...")
        transcript = transcribe_audio(file_path)
        print("\nTranscript:\n", transcript)

        print("\nAnalyzing for stuttering...")
        analysis = analyze_stuttering(transcript)
        print("\nStuttering Analysis Result:\n", analysis)
