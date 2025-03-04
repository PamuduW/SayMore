import re
import librosa
import numpy as np
import parselmouth


def hz_to_semitones(pitch_hz, reference_pitch=100.0):
    return 12 * np.log2(pitch_hz / reference_pitch)


def analyze_pitch(audio_path, segment_duration=2.0):
    try:
        snd = parselmouth.Sound(audio_path)
        duration = snd.get_total_duration()
        pitch = snd.to_pitch()
        pitch_values = pitch.selected_array["frequency"]
        time_stamps = pitch.xs()

        # Only consider voiced segments.
        voiced_indices = pitch_values > 0
        pitch_values = pitch_values[voiced_indices]
        time_stamps = time_stamps[voiced_indices]

        if pitch_values.size == 0:
            return {"error": "No voiced pitch detected."}

        semitone_values = hz_to_semitones(pitch_values)
        overall_std = np.std(semitone_values)
        overall_range = np.max(semitone_values) - np.min(semitone_values)
        # Higher monotony means less variation.
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
                    "pitch_range_ST": float(round(np.max(segment_pitches) - np.min(segment_pitches), 2)),
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
    snd = parselmouth.Sound(audio_path)
    duration = snd.get_total_duration()
    jitter_data = {}

    for t in np.arange(0, duration, segment_duration):
        segment = snd.extract_part(from_time=t, to_time=min(t + segment_duration, duration))
        point_process = parselmouth.praat.call(segment, "To PointProcess (periodic, cc)", 75, 500)
        jitter_local = parselmouth.praat.call(point_process, "Get jitter (local)", 0, 0, 0.0001, 0.02, 1.3)
        jitter_value = float(round(jitter_local, 6)) if not np.isnan(jitter_local) else 0.0
        jitter_data[round(t, 2)] = jitter_value

    overall_jitter = float(np.nanmean(list(jitter_data.values())))
    return {"jitter_data": jitter_data, "overall_jitter": overall_jitter}


def analyze_shimmer(audio_path, segment_duration=2.0):
    snd = parselmouth.Sound(audio_path)
    duration = snd.get_total_duration()
    shimmer_data = {}

    for t in np.arange(0, duration, segment_duration):
        segment = snd.extract_part(from_time=t, to_time=min(t + segment_duration, duration))
        point_process = parselmouth.praat.call(segment, "To PointProcess (periodic, cc)", 75, 500)
        shimmer_local = parselmouth.praat.call([segment, point_process],
                                               "Get shimmer (local)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_value = float(round(shimmer_local, 4)) if not np.isnan(shimmer_local) else 0.0
        shimmer_data[round(t, 2)] = shimmer_value

    overall_shimmer = float(np.nanmean(list(shimmer_data.values())))
    return {"shimmer_data": shimmer_data, "overall_shimmer": overall_shimmer}


def analyze_hnr(audio_path, segment_duration=2.0):
    snd = parselmouth.Sound(audio_path)
    duration = snd.get_total_duration()
    hnr_data = {}

    for t in np.arange(0, duration, segment_duration):
        segment = snd.extract_part(from_time=t, to_time=min(t + segment_duration, duration))
        harmonicity = parselmouth.praat.call(segment, "To Harmonicity (cc)", 0.01, 75, 0.1, 1.0)
        hnr_value = parselmouth.praat.call(harmonicity, "Get mean", 0, 0)
        hnr_value = float(max(round(hnr_value, 2), 0.0))
        hnr_data[round(t, 2)] = hnr_value

    overall_hnr = float(np.mean(list(hnr_data.values())))
    return {"hnr_data": hnr_data, "overall_hnr": overall_hnr}


def analyze_speaking_speed(audio_path, text):
    y, sr = librosa.load(audio_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)
    words = len(re.findall(r"\b\w+\b", text))
    words_per_minute = words / (duration / 60) if duration > 0 else 0
    return float(round(words_per_minute, 2))


def analyze_clarity(audio_path):
    """
    Compute clarity based on the coefficient of variation (CV) of formant frequencies.
    Lower CV suggests more stable articulation.
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


def generate_speaking_score(monotony_score, speaking_speed, clarity, jitter, shimmer, hnr):
    """
    Generate a voice quality score based on:
      - Monotony: 25%
      - Speaking speed: 20%
      - Clarity: 30%
      - Stability (derived from jitter, shimmer, HNR): 25%
    """
    weights = {
        "monotony": 0.25,
        "speed": 0.20,
        "clarity": 0.30,
        "stability": 0.25,
    }

    # Compute stability: lower jitter and shimmer are better.
    stability_score = 100 - ((jitter * 100) + (shimmer * 100))
    stability_score += hnr / 2  # Bonus for higher harmonicity.
    stability_score = float(max(0, min(100, round(stability_score, 2))))

    # Normalize speaking speed using an ideal of 130 words per minute.
    speed_score = float(max(0, 100 - abs(speaking_speed - 130)))

    final_score = (
            monotony_score * weights["monotony"]
            + speed_score * weights["speed"]
            + clarity * weights["clarity"]
            + stability_score * weights["stability"]
    )
    final_score = float(max(0, min(100, round(final_score, 2))))
    return final_score


def generate_base_feedback(final_voice_score):
    """Generate base feedback based on the overall final voice score."""
    if final_voice_score >= 85:
        return "Excellent! Your vocal delivery is outstanding in expressiveness and control."
    elif final_voice_score >= 70:
        return "Very good! Your voice is dynamic overall, though there is room for further enhancement."
    elif final_voice_score >= 55:
        return "Good effort! Your voice quality is adequate, but some areas could benefit from improvement."
    elif final_voice_score >= 40:
        return "Fair performance. Consider working on key aspects to enhance your vocal delivery."
    else:
        return "Needs improvement. Your vocal delivery requires significant work."


def generate_dynamic_feedback(monotony_score, stability_score, speaking_speed, clarity):
    """Generate detailed dynamic feedback based on individual metrics."""
    # Monotony (pitch variation) feedback.
    if monotony_score >= 85:
        monotony_feedback = "Your pitch variation is excellent."
    elif monotony_score >= 70:
        monotony_feedback = "Your pitch variation is very good; a bit more variation could enhance expressiveness."
    elif monotony_score >= 55:
        monotony_feedback = "Your pitch variation is moderate; consider adding more variation to capture attention."
    elif monotony_score >= 40:
        monotony_feedback = "Your pitch variation is low; work on incorporating more tonal shifts."
    else:
        monotony_feedback = "Your pitch variation is minimal; significant variation is needed."

    # Stability feedback.
    if stability_score >= 85:
        stability_feedback = "Your voice stability is excellent."
    elif stability_score >= 70:
        stability_feedback = "Your voice stability is very good; slight inconsistencies are observed."
    elif stability_score >= 55:
        stability_feedback = "Your voice stability is moderate; consider practicing control techniques."
    elif stability_score >= 40:
        stability_feedback = "Your voice stability is low; focus on reducing fluctuations."
    else:
        stability_feedback = "Your voice stability is poor; significant improvement is needed."

    # Speaking speed feedback.
    speed_score = float(max(0, 100 - abs(speaking_speed - 130)))
    if speed_score >= 85:
        speed_feedback = "Your speaking speed is ideal."
    elif speed_score >= 70:
        speed_feedback = "Your speaking speed is good; slight adjustments could enhance clarity."
    elif speed_score >= 55:
        speed_feedback = "Your speaking speed is moderate; try to optimize your pace for better comprehension."
    elif speed_score >= 40:
        speed_feedback = "Your speaking speed is suboptimal; work on finding a balanced pace."
    else:
        speed_feedback = "Your speaking speed needs significant improvement."

    # Clarity feedback.
    if clarity >= 85:
        clarity_feedback = "Your clarity is exceptional."
    elif clarity >= 70:
        clarity_feedback = "Your clarity is very good."
    elif clarity >= 55:
        clarity_feedback = "Your clarity is moderate; clearer articulation would help."
    elif clarity >= 40:
        clarity_feedback = "Your clarity is low; focus on enunciating more distinctly."
    else:
        clarity_feedback = "Your clarity needs major improvement."

    dynamic_feedback = f"{monotony_feedback} {stability_feedback} {speed_feedback} {clarity_feedback}"
    return dynamic_feedback


def analyze_speech_1(audio_path, text):
    pitch_data = analyze_pitch(audio_path)
    speaking_speed = analyze_speaking_speed(audio_path, text)
    clarity = analyze_clarity(audio_path)
    jitter_data = analyze_jitter(audio_path)
    shimmer_data = analyze_shimmer(audio_path)
    hnr_data = analyze_hnr(audio_path)

    if "error" in pitch_data:
        return {"error": pitch_data["error"]}

    # Compute the final overall voice score.
    final_voice_score = generate_speaking_score(
        pitch_data["monotony_score"],
        speaking_speed,
        clarity,
        jitter_data["overall_jitter"],
        shimmer_data["overall_shimmer"],
        hnr_data["overall_hnr"],
    )

    # Recompute stability score for detailed feedback.
    stability_score = 100 - ((jitter_data["overall_jitter"] * 100) + (shimmer_data["overall_shimmer"] * 100))
    stability_score += hnr_data["overall_hnr"] / 2
    stability_score = float(max(0, min(100, round(stability_score, 2))))

    base_feedback = generate_base_feedback(final_voice_score)
    dynamic_feedback = generate_dynamic_feedback(
        monotony_score=pitch_data["monotony_score"],
        stability_score=stability_score,
        speaking_speed=speaking_speed,
        clarity=clarity
    )

    return {
        "final_voice_score": final_voice_score,
        "monotony_score": pitch_data["monotony_score"],
        "stability_score": stability_score,
        "speaking_speed": speaking_speed,
        "clarity": clarity,
        "overall_jitter_score": jitter_data["overall_jitter"],
        "overall_shimmer_score": shimmer_data["overall_shimmer"],
        "overall_hnr_score": hnr_data["overall_hnr"],
        "base_feedback": base_feedback,
        "dynamic_feedback": dynamic_feedback,
        "jitter_data": jitter_data["jitter_data"],
        "shimmer_data": shimmer_data["shimmer_data"],
        "hnr_data": hnr_data["hnr_data"],
        "pitch_data": pitch_data["pitch_analysis"],
    }
