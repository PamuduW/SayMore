import streamlit as st
import tempfile
import speech_recognition as sr
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# Load environment variables (for your Gemini API key)
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini client
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

st.title("Audio Stutter Analysis with Gemini")

# Upload audio
uploaded_file = st.file_uploader("Upload a .wav file", type=["wav"])

if uploaded_file is not None:
    # Save the audio file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        tmp_file.write(uploaded_file.read())
        tmp_file_path = tmp_file.name

    # Transcribe using SpeechRecognition
    recognizer = sr.Recognizer()
    with sr.AudioFile(tmp_file_path) as source:
        audio_data = recognizer.record(source)
        try:
            transcript = recognizer.recognize_google(audio_data)
            st.subheader("Transcript")
            st.write(transcript)
        except Exception as e:
            st.error(f"Error transcribing audio: {e}")
            transcript = ""

    if transcript:
        # Gemini analysis prompt
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
            response = model.generate_content(system_prompt)
            # Gemini gives plain text, so we try to parse JSON from it
            json_output = response.text.strip()
            try:
                parsed_json = json.loads(json_output)
            except:
                parsed_json = {"raw_output": json_output}

            st.subheader("Gemini Analysis")
            st.json(parsed_json)
        except Exception as e:
            st.error(f"Error with Gemini API: {e}")
