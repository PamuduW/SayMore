import streamlit as st
import openai as genai  # Changed from google.generativeai to openai
import tempfile
import speech_recognition as sr
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure OpenAI
genai.api_key = GEMINI_API_KEY

# Streamlit UI
st.title("Audio Stutter Analysis with OpenAI")

# Upload audio file
uploaded_file = st.file_uploader("Upload a .wav file", type=["wav"])

if uploaded_file is not None:
    # Save uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        tmp_file.write(uploaded_file.read())
        tmp_file_path = tmp_file.name

    # Transcribe audio using Google Speech Recognition
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

    # If transcript exists, analyze using OpenAI
    if transcript:
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
            response = genai.Completion.create(
                engine="text-davinci-003",
                prompt=f"{system_prompt}\n\n{transcript}",
                max_tokens=500
            )
            gpt_response = response.choices[0].text.strip()

            st.subheader("OpenAI Analysis")
            st.code(gpt_response, language='json')
        except Exception as e:
            st.error(f"Error processing OpenAI response: {e}")