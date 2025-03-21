import os
import json
import google.generativeai as genai
import speech_recognition as sr
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Ensure API key is available
if not GEMINI_API_KEY:
    print("Error: Google Gemini API key not found.")
    exit()

# Configure Google Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Audio file path
audio_file_path = r"D:\Downloads\d.wav"

# Function to analyze audio stutter using the Google Gemini API
def analyze_audio_stutter(audio_file_path):
    print(f"Using Gemini API Key: {GEMINI_API_KEY}")

    # Initialize the recognizer
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(audio_file_path) as source:
            audio_data = recognizer.record(source)
            try:
                # Convert speech to text (transcript)
                transcript = recognizer.recognize_google(audio_data)
                print("\nTranscript:\n", transcript)
            except sr.UnknownValueError:
                print("Speech Recognition could not understand audio.")
                transcript = ""
            except sr.RequestError as e:
                print(f"Speech Recognition API error: {e}")
                transcript = ""

    except FileNotFoundError:
        print(f"Error: Audio file not found at {audio_file_path}")
        return

    # Check if transcript exists before proceeding
    if transcript:
        system_prompt = (
            "You are an AI speech pathology expert analyzing a person's speech for stuttering patterns. "
            "Detect stuttering types such as repetitions, prolongations, and blocks, and assess fluency levels. "
            "Return a JSON object with:\n"
            "- 'language': Detected language\n"
            "- 'stutter_count': Number of detected stuttering events\n"
            "- 'stuttered_words': List of words/phrases affected by stuttering\n"
            "- 'stuttering_types': Breakdown of stuttering types (e.g., repetitions, prolongations)\n"
            "- 'cluttering_detected': True/False\n"
            "- 'fluency_score': Fluency rating (0-100)\n"
            "- 'confidence_score': AI confidence (0-1)\n"
            f"Analyze the following transcript:\n'''\n{transcript}\n'''"
        )

        try:
            # Load Gemini model
            model = genai.GenerativeModel("gemini-pro-vision")

            # Read and send the audio file as input
            with open(audio_file_path, "rb") as audio_file:
                response = model.generate_content(
                    [system_prompt, audio_file.read()]
                )

            # Extract and parse the AI response
            json_output = response.text.strip()
            try:
                parsed_json = json.loads(json_output)
            except json.JSONDecodeError:
                parsed_json = {"raw_output": json_output}

            print("\nGemini AI Stuttering Analysis:")
            print(json.dumps(parsed_json, indent=4))

        except Exception as e:
            print(f"Error with Gemini API: {e}")
    else:
        print("No transcript available for analysis.")

# Run the stuttering analysis
analyze_audio_stutter(audio_file_path)
