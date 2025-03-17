import re
import librosa
import numpy as np
import parselmouth

def normalize_metric(value, best, worst, invert=False):
    """
    Normalize a raw value to a 0–100 scale.
    For metrics where lower is better (like jitter/shimmer), set invert=True.
    'best' is the ideal value and 'worst' is the threshold for a score of 0.
    """
    if worst == best:
        return 100.0
    if invert:
        score = (1 - (value - best) / (worst - best)) * 100
    else:
        score = ((value - best) / (worst - best)) * 100
    return float(max(0, min(100, round(score, 2))))

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
        # Monotony score: higher means more monotone (less variation)
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
    snd = parselmouth.Sound(audio_path)
    formants = snd.to_formant_burg()

    formant_values = {i: [] for i in range(1, 4)}  # Store F1, F2, and F3
    times = np.arange(0, snd.get_total_duration(), 0.01)

    for t in times:
        for i in range(1, 4):
            value = formants.get_value_at_time(i, t)
            if value is not None:
                formant_values[i].append(value)

    means = {i: np.mean(formant_values[i]) for i in formant_values}
    std_devs = {i: np.std(formant_values[i]) for i in formant_values}

    clarity_score = 1 - (
            abs(means[1] - means[2]) +
            abs(means[2] - means[3]) +
            abs(means[1] - means[3]) +
            std_devs[1] + std_devs[2] + std_devs[3]
    ) / 6000

    return max(0, min(1, round(clarity_score, 4)))


# Generate final public speaking score
def generate_speaking_score(
    monotony_score, speaking_speed, clarity, jitter, shimmer, hnr
):
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

def generate_dynamic_feedback(variation_score, stability_score, speaking_speed, clarity):
    if variation_score >= 85:
        variation_feedback = "Your pitch variation is excellent, keeping your delivery lively."
    elif variation_score >= 70:
        variation_feedback = "Your pitch variation is very good; a bit more dynamism could further captivate your audience."
    elif variation_score >= 55:
        variation_feedback = "Your pitch variation is moderate; consider adding more tonal shifts for expressiveness."
    elif variation_score >= 40:
        variation_feedback = "Your pitch variation is low; increasing vocal variation can make your speech more engaging."
    else:
        variation_feedback = "Your pitch variation is minimal; significant improvement in vocal variation is needed."

    if stability_score >= 85:
        stability_feedback = "Your voice stability is excellent, indicating strong vocal control."
    elif stability_score >= 70:
        stability_feedback = "Your voice stability is very good; slight inconsistencies are observed."
    elif stability_score >= 55:
        stability_feedback = "Your voice stability is moderate; practicing consistent control might help."
    elif stability_score >= 40:
        stability_feedback = "Your voice stability is low; focusing on steady control can enhance your delivery."
    else:
        stability_feedback = "Your voice stability is poor; significant improvement is needed to maintain consistency."

    if speaking_speed >= 140:
        speed_feedback = "Your speaking speed is a bit fast; consider slowing down for clarity."
    elif speaking_speed >= 120:
        speed_feedback = "Your speaking speed is ideal."
    elif speaking_speed >= 100:
        speed_feedback = "Your speaking speed is good, though a slight increase could boost engagement."
    elif speaking_speed >= 80:
        speed_feedback = "Your speaking speed is a bit slow; try to increase your pace for a more dynamic delivery."
    else:
        speed_feedback = "Your speaking speed is too slow; working on a more energetic pace may help."

    if clarity >= 85:
        clarity_feedback = "Your clarity is exceptional, making your speech easily understandable."
    elif clarity >= 70:
        clarity_feedback = "Your clarity is very good; minor improvements could sharpen your articulation even more."
    elif clarity >= 55:
        clarity_feedback = "Your clarity is moderate; focusing on enunciation could enhance your message."
    elif clarity >= 40:
        clarity_feedback = "Your clarity is low; work on pronunciation and articulation to improve understanding."
    else:
        clarity_feedback = "Your clarity needs significant improvement; consider vocal exercises to enhance articulation."

    dynamic_feedback = (
        f"Additionally, {variation_feedback} {stability_feedback} {speed_feedback} {clarity_feedback}"
    )
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

    # Calculate variation_score from monotony_score (higher variation is better)
    variation_score = float(max(0, min(100, round(100 - pitch_data["monotony_score"], 2))))

    final_voice_score = generate_speaking_score(
        variation_score,
        speaking_speed,
        clarity,
        jitter_data["overall_jitter"],
        shimmer_data["overall_shimmer"],
        hnr_data["overall_hnr"],
    )

    stability_score = 100 - ((jitter_data["overall_jitter"] * 100) + (shimmer_data["overall_shimmer"] * 100))
    stability_score += hnr_data["overall_hnr"] / 2
    stability_score = float(max(0, min(100, round(stability_score, 2))))

    base_feedback = generate_base_feedback(final_voice_score)
    dynamic_feedback = generate_dynamic_feedback(
        variation_score=variation_score,
        stability_score=stability_score,
        speaking_speed=speaking_speed,
        clarity=clarity
    )

    # Normalize overall jitter, shimmer, and HNR to a 0–100 scale.
    normalized_jitter = normalize_metric(jitter_data["overall_jitter"], best=0, worst=0.1, invert=True)
    normalized_shimmer = normalize_metric(shimmer_data["overall_shimmer"], best=0, worst=0.3, invert=True)
    normalized_hnr = normalize_metric(hnr_data["overall_hnr"], best=0, worst=30, invert=False)

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
