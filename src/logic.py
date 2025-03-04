from Model.stutteringModel import stutter_test
from src.ps_test_cat1 import analyze_speech_1
from src.ps_test_cat2 import analyze_speech_2
from src.speech_to_text import transcribe_gcs
import numpy as np


def analysing_audio(file_name, test_type, lan_flag):
    try:
        if test_type:
            analysis_result = ps_test(file_name, lan_flag)
        else:
            analysis_result = stutter_test(file_name)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}


def generate_overall_score(voice_data: dict, energy_data: dict, avg_confidence: float) -> float:
    """
    Combine the voice quality, energy analysis, and transcription confidence into a final score.
    We use weights of 0.4 for voice, 0.4 for energy, and 0.2 for confidence.
    """
    voice_score = voice_data.get("final_voice_score", 0)
    energy_score = energy_data.get("final_energy_score", 0)
    overall_score = (voice_score * 0.4) + (energy_score * 0.4) + (avg_confidence * 0.2)
    return max(0, min(100, round(overall_score, 2)))


def ps_test(audio_path, lan_flag):
    # Construct the Google Cloud Storage URI.
    gcs_uri = f"gs://saymore-340e9.firebasestorage.app/{audio_path}"

    # Get the transcription from Google Speech-to-Text.
    transcribe = transcribe_gcs(gcs_uri, long_flag=True, lan_flag=lan_flag)
    text = ""
    confidences = []
    for t in transcribe:
        text += t.get("transcript", "")
        if "confidence" in t:
            confidences.append(t["confidence"])
    avg_confidence = round(np.mean(confidences), 2) if confidences else 100

    # Get voice quality & stability analysis.
    voice_data = analyze_speech_1(audio_path, text)
    # Get speech intensity & energy analysis.
    energy_data = analyze_speech_2(audio_path)

    overall_score = generate_overall_score(voice_data, energy_data, avg_confidence)

    return {
        "transcription": transcribe,
        "avg_confidence": avg_confidence,
        "Voice Quality & Stability Data": voice_data,
        "Speech Intensity & Energy Data": energy_data,
        "final_public_speaking_score": overall_score,
    }
