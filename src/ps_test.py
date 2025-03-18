import numpy as np

from src.ps_test_cat1 import analyze_speech_1
from src.ps_test_cat2 import analyze_speech_2
from src.speech_to_text import transcribe_gcs


def generate_overall_score(
    voice_data: dict, energy_data: dict, avg_confidence: float
) -> float:
    """Combine the voice quality, energy analysis, and transcription confidence into a final score.
    We use weights of 0.4 for voice, 0.4 for energy, and 0.2 for confidence.
    """
    voice_score = voice_data.get("final_voice_score", 0)
    energy_score = energy_data.get("final_energy_score", 0)
    overall_score = (voice_score * 0.4) + (energy_score * 0.4) + (avg_confidence * 0.2)
    return max(0, min(100, round(overall_score, 2)))


def generate_final_public_speaking_feedback(final_public_speaking_score):
    """Generate overall feedback for the final public speaking score."""
    if final_public_speaking_score >= 90:
        return (
            "Outstanding public speaking performance! Your delivery is powerful, dynamic, and highly engaging, "
            "capturing your audience's attention effortlessly."
        )
    elif final_public_speaking_score >= 80:
        return (
            "Excellent performance! Your speaking skills and energy are well-honed, demonstrating strong vocal "
            "presence and effective engagement."
        )
    elif final_public_speaking_score >= 70:
        return (
            "Very good work! You have a solid public speaking foundation, though refining a few aspects of your "
            "vocal delivery and energy could elevate your impact even further."
        )
    elif final_public_speaking_score >= 60:
        return (
            "Good performance overall, but there is room for improvement. Focus on enhancing both your vocal "
            "dynamics and energy to create a more compelling and engaging presentation."
        )
    elif final_public_speaking_score >= 50:
        return (
            "Fair performance. With additional practice and attention to your vocal delivery and energy, "
            "you can significantly boost your public speaking effectiveness."
        )
    else:
        return (
            "Your public speaking performance needs improvement. Consider working on your vocal control, energy, "
            "and expressiveness to better captivate your audience."
        )


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

    final_feedback = generate_final_public_speaking_feedback(overall_score)

    return {
        "final_public_speaking_score": overall_score,
        "final_public_speaking_feedback": final_feedback,
        "overall_confidence": avg_confidence,
        "transcription": transcribe,
        "Voice_Quality_&_Stability_Data": voice_data,
        "Speech_Intensity_&_Energy_Data": energy_data,
    }
