import tempfile
import speech_recognition as sr
import requests  # For API requests to Gemini
import json
import os
from dotenv import load_dotenv
from google import genai

# Load environment variables (API key will be retrieved from .env file)
load_dotenv()

# Gemini API Key loaded from environment variables (or hardcoded for testing)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Check if the API key is loaded
if not GEMINI_API_KEY:
    print("Error: Gemini API key not found in .env file. Make sure you have a .env file in the correct directory.")
    exit()

# Audio file path
audio_file_path = "D:\\Downloads\\d.wav"  # Ensure to use raw string or double backslashes for file path


# Initialize the Google Gemini client with the API key
client = genai.Client(api_key="AIzaSyATh0uB7jh2EFpkVePJwdgX85daKn3zoho")


# Function to analyze audio stutter using the Gemini API
def analyze_audio_stutter(audio_file_path):
    print(f"Using Gemini API Key: {GEMINI_API_KEY}")  # Debugging: Verify API Key

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file_path) as source:
            audio_data = recognizer.record(source)
            try:
                transcript = recognizer.recognize_google(audio_data)
                print("Transcript:")
                print(transcript)
            except sr.UnknownValueError:
                print("Speech Recognition could not understand audio")
                transcript = ""
            except sr.RequestError as e:
                print(f"Could not request results from Speech Recognition service; {e}")
                transcript = ""
    except FileNotFoundError:
        print(f"Error: Audio file not found at {audio_file_path}")
        return  # Exit if the file doesn't exist

    if transcript:
        # Constructing the request payload for Gemini API
        payload = {
            "text": transcript,  # Assuming the Gemini API accepts the transcript text
            "api_key": GEMINI_API_KEY,
            "task": "stuttering_analysis"  # Assuming the Gemini API has a stuttering analysis task
        }

        try:
            # Send the request to Gemini API (adjust URL to actual endpoint)
            response = requests.post("https://api.gemini.com/analyze", json=payload)

            if response.status_code == 200:
                # Assuming the API returns a JSON response
                gemini_analysis = response.json()

                print("\nGemini Analysis:")
                print(json.dumps(gemini_analysis, indent=4))
            else:
                print(f"Error from Gemini API: {response.status_code} - {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"Request Error: {e}")
    else:
        print("No transcript to analyze.")


# Call the function to analyze stutter
analyze_audio_stutter(audio_file_path)


