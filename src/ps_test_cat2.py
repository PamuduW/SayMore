import librosa
import numpy as np


def analyze_intensity(audio_path, segment_duration=2.0):
    y, sr = librosa.load(audio_path, sr=None)
    rms_energy = librosa.feature.rms(y=y)[0]
    duration = librosa.get_duration(y=y, sr=sr)
    frame_times = np.linspace(0, duration, num=len(rms_energy))
    intensity_data = {}

    for t in np.arange(0, duration, segment_duration):
        mask = (frame_times >= t) & (frame_times < t + segment_duration)
        segment_rms = rms_energy[mask]
        if segment_rms.size > 0:
            segment_intensity = np.mean(segment_rms)
            intensity_data[round(t, 2)] = float(round(segment_intensity * 200, 4))
        else:
            intensity_data[round(t, 2)] = 0.0

    return intensity_data


def analyze_energy(audio_path, segment_duration=2.0):
    y, sr = librosa.load(audio_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)
    energy_data = {}

    for t in np.arange(0, duration, segment_duration):
        start = int(t * sr)
        end = min(int((t + segment_duration) * sr), len(y))
        segment = y[start:end]
        if segment.size > 0:
            energy = np.sum(segment**2)
            log_energy = max(np.log10(energy + 1e-8) * 10, 0)
            energy_data[round(t, 2)] = float(round(log_energy * 10, 2))
        else:
            energy_data[round(t, 2)] = 0.0

    return energy_data


def analyze_speech_2(audio_path, segment_duration=2.0):
    intensity_data = analyze_intensity(audio_path, segment_duration)
    energy_data = analyze_energy(audio_path, segment_duration)

    intensity_values = list(intensity_data.values())
    energy_values = list(energy_data.values())

    if not intensity_values or not energy_values:
        return {"error": "No valid intensity or energy data detected."}

    avg_intensity = float(np.mean(intensity_values))
    avg_energy = float(np.mean(energy_values))
    intensity_variation = float(np.std(intensity_values))
    energy_variation = float(np.std(energy_values))

    # Normalize energy score.
    max_possible_energy = 250
    normalized_energy = (avg_energy / max_possible_energy) * 100
    energy_score = float(round(np.clip(normalized_energy, 5, 100), 2))

    # Normalize intensity score.
    scaled_intensity = np.log1p(avg_intensity * 20) * 10
    intensity_score = float(round(np.clip(scaled_intensity, 5, 100), 2))

    # Variation score.
    max_variation = 50
    normalized_variation = np.log1p((intensity_variation + energy_variation) / max_variation) * 100
    variation_score = float(round(np.clip(normalized_variation, 5, 100), 2))

    # Combine the scores using weighted averages.
    final_energy_score = float(round(0.4 * intensity_score + 0.4 * energy_score + 0.2 * variation_score, 2))

    # Base feedback based on the final energy score.
    if final_energy_score >= 85:
        base_feedback = (
            "Excellent! Your speech exhibits outstanding dynamic energy, intensity, and variation—highly engaging and captivating."
        )
    elif final_energy_score >= 70:
        base_feedback = (
            "Very good! Your speech energy is dynamic, though slight improvements could elevate your delivery even further."
        )
    elif final_energy_score >= 55:
        base_feedback = (
            "Good effort! Your energy and intensity are on the right track, but more variation might boost your overall impact."
        )
    elif final_energy_score >= 40:
        base_feedback = (
            "Fair performance. Consider working on both your intensity and energy dynamics to better engage your audience."
        )
    else:
        base_feedback = (
            "Needs improvement. Your speech lacks sufficient dynamic energy and variation."
        )

    # Specific dynamic feedback based on individual scores.
    specific_feedbacks = []
    if intensity_score < 50:
        specific_feedbacks.append("Try projecting your voice more and varying your volume to enhance intensity.")
    if energy_score < 50:
        specific_feedbacks.append("Inject more enthusiasm into your delivery to boost overall energy.")
    if variation_score < 50:
        specific_feedbacks.append("Incorporate more pauses or changes in pace to create greater variation in your speech.")

    # Combine base and specific feedback.
    if specific_feedbacks:
        dynamic_feedback = f"{base_feedback} Additionally, " + " ".join(specific_feedbacks)
    else:
        dynamic_feedback = base_feedback

    return {
        "final_energy_score": final_energy_score,
        "intensity_score": intensity_score,
        "energy_score": energy_score,
        "variation_score": variation_score,
        "feedback": dynamic_feedback,
        "intensity_analysis": intensity_data,
        "energy_analysis": energy_data,
    }
