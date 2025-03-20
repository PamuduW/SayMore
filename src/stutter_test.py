import streamlit as st
import tempfile
import speech_recognition as sr
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

# Load .env variables (make sure you have GEMINI_API_KEY in your .env)
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Streamlit app
st.title("Audio Stutter Analysis with Gemini AI")

uploaded_file = st.file_uploader("Upload a .wav file", type=["wav"])

if uploaded_file is not None:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        tmp_file.write(uploaded_file.read())
        tmp_file_path = tmp_file.name

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
        # Gemini system instructions (Prompt Engineering)
        prompt = f"""
        You are an expert speech-language pathologist. Analyze the following transcript for signs of stuttering.

        Look for:
        - Sound repetitions
        - Syllable repetitions
        - Word repetitions
        - Prolongations
        - Blocks (silent pauses)
        - Signs of cluttering (fast/irregular speech)

        Also, detect the language and assign a fluency score (0-100).

        Return JSON with:
        {{
            "language": ...,
            "stutter_count": ...,
            "stuttered_words": [...],
            "cluttering_detected": true/false,
            "fluency_score": ...,
            "confidence_score": ...
        }}

        Transcript:
        \"\"\"{transcript}\"\"\"
        """

        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            st.subheader("Gemini AI Analysis")
            try:
                # Try to parse JSON response if possible
                response_json = json.loads(response.text)
                st.json(response_json)
            except:
                st.write(response.text)
        except Exception as e:
            st.error(f"Error with Gemini API: {e}")
