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
            # Multiply by 200 to scale up the raw RMS values
            segment_intensity = np.mean(segment_rms) * 200
            intensity_data[round(t, 2)] = float(round(segment_intensity, 4))
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
            # Use log10 to compress the range and then scale up
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

    # --- Normalization Adjustments ---
    # Energy score: Instead of forcing a lower bound of 5, we allow 0 to 100.
    max_possible_energy = 250  # You may adjust this based on empirical data.
    normalized_energy = (avg_energy / max_possible_energy) * 100
    energy_score = float(round(np.clip(normalized_energy, 0, 100), 2))

    # Intensity score: Use a logarithmic transformation to expand low values.
    # Adjust multiplier (e.g., 30 instead of 20) to provide more variation.
    scaled_intensity = np.log1p(avg_intensity * 30) * 10
    intensity_score = float(round(np.clip(scaled_intensity, 0, 100), 2))

    # Variation score: Combine the variation in intensity and energy.
    max_variation = 50  # Adjust based on expected standard deviations.
    normalized_variation = np.log1p((intensity_variation + energy_variation) / max_variation) * 100
    variation_score = float(round(np.clip(normalized_variation, 0, 100), 2))
    # ---------------------------------

    # Final energy score: Weighted average of the three components.
    final_energy_score = float(
        round(0.4 * intensity_score + 0.4 * energy_score + 0.2 * variation_score, 2)
    )

    # --- Base Feedback Based on Final Energy Score ---
    if final_energy_score >= 85:
        base_feedback = (
            "Excellent! Your speech exhibits outstanding dynamic energy, intensity, and variation—highly engaging and captivating."
        )
    elif final_energy_score >= 70:
        base_feedback = (
            "Very good! Your overall energy is strong, though slight improvements could elevate your delivery even further."
        )
    elif final_energy_score >= 55:
        base_feedback = (
            "Good effort! Your energy is adequate, but there’s room for improvement in making your delivery more engaging."
        )
    elif final_energy_score >= 40:
        base_feedback = (
            "Fair performance. Your overall energy is a bit low; consider working on both your intensity and variation."
        )
    else:
        base_feedback = (
            "Needs improvement. Your speech lacks dynamic energy and variation, making it less engaging."
        )

    # --- Detailed Feedback for Each Specific Metric ---

    # Intensity Feedback
    if intensity_score >= 85:
        intensity_feedback = "Your vocal intensity is excellent, projecting powerfully throughout."
    elif intensity_score >= 70:
        intensity_feedback = "Your vocal intensity is very good; a bit more volume variation could add extra impact."
    elif intensity_score >= 55:
        intensity_feedback = "Your vocal intensity is moderate; consider projecting more to boost engagement."
    elif intensity_score >= 40:
        intensity_feedback = "Your vocal intensity is low; try to speak with greater projection and dynamic volume."
    else:
        intensity_feedback = "Your vocal intensity is minimal; significant improvement is needed to capture attention."

    # Energy Feedback
    if energy_score >= 85:
        energy_feedback = "Your energy level is outstanding, keeping your audience captivated."
    elif energy_score >= 70:
        energy_feedback = "Your energy level is high, though a bit more enthusiasm might further enhance your delivery."
    elif energy_score >= 55:
        energy_feedback = "Your energy level is average; infusing a bit more passion could make your speech more engaging."
    elif energy_score >= 40:
        energy_feedback = "Your energy level is below par; try to be more animated and lively in your delivery."
    else:
        energy_feedback = "Your energy level is very low; work on bringing more vitality and enthusiasm to your speech."

    # Variation Feedback
    if variation_score >= 85:
        variation_feedback = "Your speech variation is excellent, with seamless shifts in pace and pauses."
    elif variation_score >= 70:
        variation_feedback = "Your speech variation is very good; refining your pacing slightly could further enhance your delivery."
    elif variation_score >= 55:
        variation_feedback = "Your speech variation is moderate; consider incorporating more distinct changes in rhythm and tone."
    elif variation_score >= 40:
        variation_feedback = "Your speech variation is low; try adding more pauses and changes in pace to maintain engagement."
    else:
        variation_feedback = "Your speech variation is minimal; significant adjustments in pacing and delivery are needed."

    # Combine base feedback with detailed, stage-specific suggestions.
    dynamic_feedback = (
        f"Additionally, {intensity_feedback} {energy_feedback} {variation_feedback}"
    )

    return {
        "final_energy_score": final_energy_score,
        "intensity_score": intensity_score,
        "energy_score": energy_score,
        "variation_score": variation_score,
        "base_feedback": base_feedback,
        "dynamic_feedback": dynamic_feedback,
        "intensity_analysis": intensity_data,
        "energy_analysis": energy_data,
    }
