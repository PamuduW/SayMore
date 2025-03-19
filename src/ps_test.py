import numpy as np

from src.ps_test_cat1 import analyze_speech_1
from src.ps_test_cat2 import analyze_speech_2
from src.speech_to_text import transcribe_gcs


def generate_overall_score(
    voice_data: dict, energy_data: dict, avg_confidence: float
) -> float:
    """Generates an overall score based on voice data, energy data, and average confidence.

    Parameters
    ----------
    voice_data (dict): Dictionary containing voice analysis data.
    energy_data (dict): Dictionary containing energy analysis data.
    avg_confidence (float): Average confidence score from the transcription.

    Returns
    -------
    float: The overall score, rounded to two decimal places, and constrained between 0 and 100.

    """
    voice_score = voice_data.get("final_voice_score", 0)
    energy_score = energy_data.get("final_energy_score", 0)
    overall_score = (voice_score * 0.4) + (energy_score * 0.4) + (avg_confidence * 0.2)
    return max(0, min(100, round(overall_score, 2)))


def generate_final_public_speaking_feedback(final_public_speaking_score):
    """Generates feedback based on the final public speaking score.

    Parameters
    ----------
    final_public_speaking_score (float): The final score for public speaking performance.

    Returns
    -------
    str: Feedback message corresponding to the score range.

    """
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
    """Performs a public speaking test on the given audio file.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    lan_flag (str): The language flag to be used in the transcription.

    Returns
    -------
    dict: A dictionary containing the final public speaking score, feedback, overall confidence, transcription,
    voice quality and stability data, and speech intensity and energy data.

    """
    gcs_uri = f"gs://saymore-340e9.firebasestorage.app/{audio_path}"

    transcribe = transcribe_gcs(gcs_uri, long_flag=True, lan_flag=lan_flag)
    text = ""
    confidences = []
    for t in transcribe:
        text += t.get("transcript", "")
        if "confidence" in t:
            confidences.append(t["confidence"])
    avg_confidence = round(np.mean(confidences), 2) if confidences else 100

    voice_data = analyze_speech_1(audio_path, text)
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
