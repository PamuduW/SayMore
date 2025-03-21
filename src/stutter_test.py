import tempfile
import speech_recognition as sr
import requests  # For API requests to OpenAI
import json
import os
from dotenv import load_dotenv
import openai  # Assuming you're using OpenAI for the analysis

# Load environment variables (API key will be retrieved from .env file)
load_dotenv()

# OpenAI API Key loaded from environment variables (or hardcoded for testing)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Check if the API key is loaded
if not OPENAI_API_KEY:
    print("Error: OpenAI API key not found in .env file. Make sure you have a .env file in the correct directory.")
    exit()

# Configure OpenAI
openai.api_key = OPENAI_API_KEY

# Audio file path
audio_file_path = "D:\\Downloads\\your_audio_file.wav"  # Ensure to use raw string or double backslashes for file path

# Function to analyze audio stutter using the OpenAI API
def analyze_audio_stutter(audio_file_path):
    print(f"Using OpenAI API Key: {OPENAI_API_KEY}")  # Debugging: Verify API Key

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
        # System prompt to analyze stuttering
        system_prompt = (
            "You are an expert in speech and language pathology specializing in stuttering detection. "
            "Analyze the following transcript to detect signs of stuttering (e.g., repetitions, prolongations, blocks) "
            "and cluttering (irregular or fast speech patterns). "
            "Return a JSON object with the following keys:\n"
            "- 'language': detected language\n"
            "- 'stutter_count': total stutter events\n"
            "- 'stuttered_words': list of stuttered words or phrases with stutter type\n"
            "- 'cluttering_detected': true/false\n"
            "- 'fluency_score': score from 0 to 100 (higher = better fluency)\n"
            "- 'confidence_score': score from 0 to 1 (certainty of your analysis)\n\n"
            f"Transcript: '''{transcript}'''"
        )

        try:
            # Call the OpenAI API
            response = openai.Completion.create(
                engine="text-davinci-003",  # Or the engine you're using
                prompt=system_prompt,
                max_tokens=500
            )
            json_output = response.choices[0].text.strip()
            try:
                parsed_json = json.loads(json_output)
            except json.JSONDecodeError:
                parsed_json = {"raw_output": json_output}

            print("\nOpenAI Analysis:")
            print(json.dumps(parsed_json, indent=4))
        except Exception as e:
            print(f"Error with OpenAI API: {e}")
    else:
        print("No transcript to analyze.")

# Call the function to analyze stutter
analyze_audio_stutter(audio_file_path)