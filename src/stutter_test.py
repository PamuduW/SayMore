import tempfile
import speech_recognition as sr
import openai  # Assuming you're using OpenAI for the analysis
import json
import os
from dotenv import load_dotenv

# Load environment variables (for your OpenAI API key)
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Configure OpenAI
openai.api_key = OPENAI_API_KEY

# Replace this with the path to your audio file
audio_file_path = "path_to_your_audio_file.wav"

def analyze_audio_stutter(audio_file_path):
    # Initialize recognizer
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)
        try:
            transcript = recognizer.recognize_google(audio_data)
            print("Transcript:")
            print(transcript)
        except Exception as e:
            print(f"Error transcribing audio: {e}")
            transcript = ""

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

# Call the function
analyze_audio_stutter(audio_file_path)