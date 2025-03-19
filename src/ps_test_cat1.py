import re

import librosa
import numpy as np
import parselmouth


def normalize_metric(value, best, worst, invert=False):
    """Normalizes a metric to a score between 0 and 100.

    Parameters
    ----------
    value (float): The value to be normalized.
    best (float): The best possible value for normalization.
    worst (float): The worst possible value for normalization.
    invert (bool): Whether to invert the normalization scale.

    Returns
    -------
    float: The normalized score between 0 and 100.

    """
    if worst == best:
        return 100.0
    if invert:
        score = (1 - (value - best) / (worst - best)) * 100
    else:
        score = ((value - best) / (worst - best)) * 100
    return float(max(0, min(100, round(score, 2))))


def hz_to_semitones(pitch_hz, reference_pitch=100.0):
    """Converts pitch in Hertz to semitones.

    Parameters
    ----------
    pitch_hz (float): The pitch in Hertz.
    reference_pitch (float): The reference pitch in Hertz.

    Returns
    -------
    float: The pitch in semitones.

    """
    return 12 * np.log2(pitch_hz / reference_pitch)


def analyze_pitch(audio_path, segment_duration=2.0):
    """Analyzes the pitch of an audio file.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    segment_duration (float): The duration of each segment for analysis.

    Returns
    -------
    dict: A dictionary containing the monotony score and pitch analysis data.

    """
    try:
        snd = parselmouth.Sound(audio_path)
        duration = snd.get_total_duration()
        pitch = snd.to_pitch()
        pitch_values = pitch.selected_array["frequency"]
        time_stamps = pitch.xs()

        voiced_indices = pitch_values > 0
        pitch_values = pitch_values[voiced_indices]
        time_stamps = time_stamps[voiced_indices]

        if pitch_values.size == 0:
            return {"error": "No voiced pitch detected."}

        semitone_values = hz_to_semitones(pitch_values)
        overall_std = np.std(semitone_values)
        overall_range = np.max(semitone_values) - np.min(semitone_values)
        monotony_score = 100 * (1 - (overall_std / (overall_range + 1e-5)))
        monotony_score = float(max(0, min(100, round(monotony_score, 2))))

        pitch_data = {}
        for t in np.arange(0, duration, segment_duration):
            segment_indices = (time_stamps >= t) & (time_stamps < t + segment_duration)
            segment_pitches = semitone_values[segment_indices]
            if segment_pitches.size > 0:
                pitch_data[round(t, 2)] = {
                    "mean_pitch_ST": float(round(np.mean(segment_pitches), 2)),
                    "median_pitch_ST": float(round(np.median(segment_pitches), 2)),
                    "min_pitch_ST": float(round(np.min(segment_pitches), 2)),
                    "max_pitch_ST": float(round(np.max(segment_pitches), 2)),
                    "std_pitch_ST": float(round(np.std(segment_pitches), 2)),
                    "pitch_range_ST": float(
                        round(np.max(segment_pitches) - np.min(segment_pitches), 2)
                    ),
                }
            else:
                pitch_data[round(t, 2)] = {
                    "mean_pitch_ST": 0.0,
                    "median_pitch_ST": 0.0,
                    "min_pitch_ST": 0.0,
                    "max_pitch_ST": 0.0,
                    "std_pitch_ST": 0.0,
                    "pitch_range_ST": 0.0,
                }
        return {
            "monotony_score": monotony_score,
            "pitch_analysis": pitch_data,
        }
    except Exception as e:
        return {"error": str(e)}


def analyze_jitter(audio_path, segment_duration=2.0):
    """Analyzes the jitter of an audio file.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    segment_duration (float): The duration of each segment for analysis.

    Returns
    -------
    dict: A dictionary containing jitter data and overall jitter.

    """
    snd = parselmouth.Sound(audio_path)
    duration = snd.get_total_duration()
    jitter_data = {}
    for t in np.arange(0, duration, segment_duration):
        segment = snd.extract_part(
            from_time=t, to_time=min(t + segment_duration, duration)
        )
        point_process = parselmouth.praat.call(
            segment, "To PointProcess (periodic, cc)", 75, 500
        )
        jitter_local = parselmouth.praat.call(
            point_process, "Get jitter (local)", 0, 0, 0.0001, 0.02, 1.3
        )
        jitter_value = (
            float(round(jitter_local, 6)) if not np.isnan(jitter_local) else 0.0
        )
        jitter_data[round(t, 2)] = jitter_value
    overall_jitter = float(np.nanmean(list(jitter_data.values())))
    return {"jitter_data": jitter_data, "overall_jitter": overall_jitter}


def analyze_shimmer(audio_path, segment_duration=2.0):
    """Analyzes the shimmer of an audio file.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    segment_duration (float): The duration of each segment for analysis.

    Returns
    -------
    dict: A dictionary containing shimmer data and overall shimmer.

    """
    snd = parselmouth.Sound(audio_path)
    duration = snd.get_total_duration()
    shimmer_data = {}
    for t in np.arange(0, duration, segment_duration):
        segment = snd.extract_part(
            from_time=t, to_time=min(t + segment_duration, duration)
        )
        point_process = parselmouth.praat.call(
            segment, "To PointProcess (periodic, cc)", 75, 500
        )
        shimmer_local = parselmouth.praat.call(
            [segment, point_process],
            "Get shimmer (local)",
            0,
            0,
            0.0001,
            0.02,
            1.3,
            1.6,
        )
        shimmer_value = (
            float(round(shimmer_local, 4)) if not np.isnan(shimmer_local) else 0.0
        )
        shimmer_data[round(t, 2)] = shimmer_value
    overall_shimmer = float(np.nanmean(list(shimmer_data.values())))
    return {"shimmer_data": shimmer_data, "overall_shimmer": overall_shimmer}


def analyze_hnr(audio_path, segment_duration=2.0):
    """Analyzes the Harmonics-to-Noise Ratio (HNR) of an audio file.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    segment_duration (float): The duration of each segment for analysis.

    Returns
    -------
    dict: A dictionary containing HNR data and overall HNR.

    """
    snd = parselmouth.Sound(audio_path)
    duration = snd.get_total_duration()
    hnr_data = {}
    for t in np.arange(0, duration, segment_duration):
        segment = snd.extract_part(
            from_time=t, to_time=min(t + segment_duration, duration)
        )
        harmonicity = parselmouth.praat.call(
            segment, "To Harmonicity (cc)", 0.01, 75, 0.1, 1.0
        )
        hnr_value = parselmouth.praat.call(harmonicity, "Get mean", 0, 0)
        hnr_value = float(max(round(hnr_value, 2), 0.0))
        hnr_data[round(t, 2)] = hnr_value
    overall_hnr = float(np.mean(list(hnr_data.values())))
    return {"hnr_data": hnr_data, "overall_hnr": overall_hnr}


def analyze_speaking_speed(audio_path, text):
    """Analyzes the speaking speed of an audio file.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    text (str): The transcribed text of the audio file.

    Returns
    -------
    float: The speaking speed in words per minute.

    """
    y, sr = librosa.load(audio_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)
    words = len(re.findall(r"\b\w+\b", text))
    words_per_minute = words / (duration / 60) if duration > 0 else 0
    return float(round(words_per_minute, 2))


def analyze_clarity(audio_path):
    """Analyzes the clarity of an audio file.

    Parameters
    ----------
    audio_path (str): The path to the audio file.

    Returns
    -------
    float: The clarity score between 0 and 100.

    """
    snd = parselmouth.Sound(audio_path)
    formants = snd.to_formant_burg()
    f1_vals = []
    f2_vals = []
    for t in np.arange(0, snd.get_total_duration(), 0.01):
        f1 = formants.get_value_at_time(1, t)
        f2 = formants.get_value_at_time(2, t)
        if f1 is not None and f2 is not None:
            f1_vals.append(f1)
            f2_vals.append(f2)
    if not f1_vals or not f2_vals:
        return 0.0
    mean_f1 = np.mean(f1_vals)
    std_f1 = np.std(f1_vals)
    mean_f2 = np.mean(f2_vals)
    std_f2 = np.std(f2_vals)
    cv1 = std_f1 / mean_f1 if mean_f1 != 0 else 0
    cv2 = std_f2 / mean_f2 if mean_f2 != 0 else 0
    clarity_score = 100 * (1 - ((cv1 + cv2) / 2))
    clarity_score = float(max(0, min(100, round(clarity_score, 2))))
    return clarity_score


def generate_speaking_score(
    variation_score, speaking_speed, clarity, jitter, shimmer, hnr
):
    """Generates a speaking score based on various metrics.

    Parameters
    ----------
    variation_score (float): The score for pitch variation.
    speaking_speed (float): The speaking speed in words per minute.
    clarity (float): The clarity score.
    jitter (float): The jitter value.
    shimmer (float): The shimmer value.
    hnr (float): The Harmonics-to-Noise Ratio (HNR) value.

    Returns
    -------
    float: The final speaking score between 0 and 100.

    """
    weights = {
        "variation": 0.25,
        "speed": 0.20,
        "clarity": 0.30,
        "stability": 0.25,
    }
    stability_score = 100 - ((jitter * 100) + (shimmer * 100))
    stability_score += hnr / 2
    stability_score = float(max(0, min(100, round(stability_score, 2))))
    speed_score = float(max(0, 100 - abs(speaking_speed - 130)))
    final_score = (
        variation_score * weights["variation"]
        + speed_score * weights["speed"]
        + clarity * weights["clarity"]
        + stability_score * weights["stability"]
    )
    final_score = float(max(0, min(100, round(final_score, 2))))
    return final_score


def generate_base_feedback(final_voice_score):
    """Generates base feedback based on the final voice score.

    Parameters
    ----------
    final_voice_score (float): The final voice score.

    Returns
    -------
    str: The feedback message.

    """
    if final_voice_score >= 85:
        return "Excellent work! Your vocal delivery is engaging and expressive, showing outstanding control and versatility."
    elif final_voice_score >= 70:
        return "Good effort! Your vocal delivery is strong overall, though refining a few aspects could make your performance even more compelling."
    elif final_voice_score >= 55:
        return "Fair performance. Your vocal quality is adequate, but there are noticeable areas for improvement to enhance your impact."
    elif final_voice_score >= 40:
        return "Needs improvement. Your vocal delivery lacks some dynamic range; focusing on tone and expressiveness may help."
    else:
        return "Significant improvement is needed. Consider working on your tone, pace, and articulation to elevate your performance."


def generate_variation_feedback(variation_score):
    """Generates feedback based on the variation score.

    Parameters
    ----------
    variation_score (float): The score for pitch variation.

    Returns
    -------
    str: The feedback message.

    """
    if variation_score >= 85:
        return "Your pitch variation is excellent, keeping your delivery lively."
    elif variation_score >= 70:
        return "Your pitch variation is very good; a bit more dynamism could further captivate your audience."
    elif variation_score >= 55:
        return "Your pitch variation is moderate; consider adding more tonal shifts for expressiveness."
    elif variation_score >= 40:
        return "Your pitch variation is low; increasing vocal variation can make your speech more engaging."
    else:
        return "Your pitch variation is minimal; significant improvement in vocal variation is needed."


def generate_stability_feedback(stability_score):
    """Generates feedback based on the stability score.

    Parameters
    ----------
    stability_score (float): The score for voice stability.

    Returns
    -------
    str: The feedback message.

    """
    if stability_score >= 85:
        return "Your voice stability is excellent, indicating strong vocal control."
    elif stability_score >= 70:
        return "Your voice stability is very good; slight inconsistencies are observed."
    elif stability_score >= 55:
        return "Your voice stability is moderate; practicing consistent control might help."
    elif stability_score >= 40:
        return "Your voice stability is low; focusing on steady control can enhance your delivery."
    else:
        return "Your voice stability is poor; significant improvement is needed to maintain consistency."


def generate_speed_feedback(speaking_speed):
    """Generates feedback based on the speaking speed.

    Parameters
    ----------
    speaking_speed (float): The speaking speed in words per minute.

    Returns
    -------
    str: The feedback message.

    """
    if speaking_speed >= 140:
        return "Your speaking speed is a bit fast; consider slowing down for clarity."
    elif speaking_speed >= 120:
        return "Your speaking speed is ideal."
    elif speaking_speed >= 100:
        return "Your speaking speed is good, though a slight increase could boost engagement."
    elif speaking_speed >= 80:
        return "Your speaking speed is a bit slow; try to increase your pace for a more dynamic delivery."
    else:
        return "Your speaking speed is too slow; working on a more energetic pace may help."


def generate_clarity_feedback(clarity):
    """Generates feedback based on the clarity score.

    Parameters
    ----------
    clarity (float): The clarity score.

    Returns
    -------
    str: The feedback message.

    """
    if clarity >= 85:
        return "Your clarity is exceptional, making your speech easily understandable."
    elif clarity >= 70:
        return "Your clarity is very good; minor improvements could sharpen your articulation even more."
    elif clarity >= 55:
        return "Your clarity is moderate; focusing on enunciation could enhance your message."
    elif clarity >= 40:
        return "Your clarity is low; work on pronunciation and articulation to improve understanding."
    else:
        return "Your clarity needs significant improvement; consider vocal exercises to enhance articulation."


def generate_dynamic_feedback(
    variation_score, stability_score, speaking_speed, clarity
):
    """Generates dynamic feedback based on various scores.

    Parameters
    ----------
    variation_score (float): The score for pitch variation.
    stability_score (float): The score for voice stability.
    speaking_speed (float): The speaking speed in words per minute.
    clarity (float): The clarity score.

    Returns
    -------
    str: The dynamic feedback message.

    """
    variation_feedback = generate_variation_feedback(variation_score)
    stability_feedback = generate_stability_feedback(stability_score)
    speed_feedback = generate_speed_feedback(speaking_speed)
    clarity_feedback = generate_clarity_feedback(clarity)

    dynamic_feedback = f"Additionally, {variation_feedback} {stability_feedback} {speed_feedback} {clarity_feedback}"
    return dynamic_feedback


def analyze_speech_1(audio_path, text):
    """Analyzes various aspects of speech from an audio file.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    text (str): The transcribed text of the audio file.

    Returns
    -------
    dict: A dictionary containing various analysis results and feedback.

    """
    pitch_data = analyze_pitch(audio_path)
    speaking_speed = analyze_speaking_speed(audio_path, text)
    clarity = analyze_clarity(audio_path)
    jitter_data = analyze_jitter(audio_path)
    shimmer_data = analyze_shimmer(audio_path)
    hnr_data = analyze_hnr(audio_path)

    if "error" in pitch_data:
        return {"error": pitch_data["error"]}

    variation_score = float(
        max(0, min(100, round(100 - pitch_data["monotony_score"], 2)))
    )

    final_voice_score = generate_speaking_score(
        variation_score,
        speaking_speed,
        clarity,
        jitter_data["overall_jitter"],
        shimmer_data["overall_shimmer"],
        hnr_data["overall_hnr"],
    )

    stability_score = 100 - (
        (jitter_data["overall_jitter"] * 100) + (shimmer_data["overall_shimmer"] * 100)
    )
    stability_score += hnr_data["overall_hnr"] / 2
    stability_score = float(max(0, min(100, round(stability_score, 2))))

    base_feedback = generate_base_feedback(final_voice_score)
    dynamic_feedback = generate_dynamic_feedback(
        variation_score=variation_score,
        stability_score=stability_score,
        speaking_speed=speaking_speed,
        clarity=clarity,
    )

    normalized_jitter = normalize_metric(
        jitter_data["overall_jitter"], best=0, worst=0.1, invert=True
    )
    normalized_shimmer = normalize_metric(
        shimmer_data["overall_shimmer"], best=0, worst=0.3, invert=True
    )
    normalized_hnr = normalize_metric(
        hnr_data["overall_hnr"], best=0, worst=30, invert=False
    )

    return {
        "final_voice_score": final_voice_score,
        "variation_score": variation_score,
        "stability_score": stability_score,
        "speaking_speed": speaking_speed,
        "clarity": clarity,
        "overall_jitter_score": normalized_jitter,
        "overall_shimmer_score": normalized_shimmer,
        "overall_hnr_score": normalized_hnr,
        "base_feedback": base_feedback,
        "dynamic_feedback": dynamic_feedback,
        "jitter_data": jitter_data["jitter_data"],
        "shimmer_data": shimmer_data["shimmer_data"],
        "hnr_data": hnr_data["hnr_data"],
        "pitch_data": pitch_data["pitch_analysis"],
    }
