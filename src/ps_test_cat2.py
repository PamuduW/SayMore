import librosa
import numpy as np


def analyze_intensity(audio_path, segment_duration=2.0):
    """Analyzes the intensity of an audio file by calculating the root mean square (RMS) energy for segments of the audio.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    segment_duration (float): The duration of each segment in seconds. Default is 2.0 seconds.

    Returns
    -------
    dict: A dictionary where keys are segment start times and values are the calculated intensity for each segment.

    """
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
    """Analyzes the energy of an audio file by calculating the log-scaled energy for segments of the audio.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    segment_duration (float): The duration of each segment in seconds. Default is 2.0 seconds.

    Returns
    -------
    dict: A dictionary where keys are segment start times and values are the calculated energy for each segment.

    """
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


def calculate_scores(intensity_values, energy_values):
    """Calculates various scores based on intensity and energy values.

    Parameters
    ----------
    intensity_values (list): List of intensity values.
    energy_values (list): List of energy values.

    Returns
    -------
    tuple: A tuple containing intensity score, energy score, variation score, and final energy score.

    """
    avg_intensity = float(np.mean(intensity_values))
    avg_energy = float(np.mean(energy_values))
    intensity_variation = float(np.std(intensity_values))
    energy_variation = float(np.std(energy_values))

    max_possible_energy = 250
    normalized_energy = (avg_energy / max_possible_energy) * 100
    energy_score = float(round(np.clip(normalized_energy, 0, 100), 2))

    scaled_intensity = np.log1p(avg_intensity * 30) * 10
    intensity_score = float(round(np.clip(scaled_intensity, 0, 100), 2))

    max_variation = 50
    normalized_variation = (
        np.log1p((intensity_variation + energy_variation) / max_variation) * 100
    )
    variation_score = float(round(np.clip(normalized_variation, 0, 100), 2))

    final_energy_score = float(
        round(0.4 * intensity_score + 0.4 * energy_score + 0.2 * variation_score, 2)
    )

    return intensity_score, energy_score, variation_score, final_energy_score


def generate_feedback(
    final_energy_score, intensity_score, energy_score, variation_score
):
    """Generates feedback based on the calculated scores.

    Parameters
    ----------
    final_energy_score (float): The final energy score.
    intensity_score (float): The intensity score.
    energy_score (float): The energy score.
    variation_score (float): The variation score.

    Returns
    -------
    tuple: A tuple containing base feedback and dynamic feedback.

    """
    if final_energy_score >= 85:
        base_feedback = "Excellent! Your speech exhibits outstanding dynamic energy, intensity, and variation—highly engaging and captivating."
    elif final_energy_score >= 70:
        base_feedback = "Very good! Your overall energy is strong, though slight improvements could elevate your delivery even further."
    elif final_energy_score >= 55:
        base_feedback = "Good effort! Your energy is adequate, but there’s room for improvement in making your delivery more engaging."
    elif final_energy_score >= 40:
        base_feedback = "Fair performance. Your overall energy is a bit low; consider working on both your intensity and variation."
    else:
        base_feedback = "Needs improvement. Your speech lacks dynamic energy and variation, making it less engaging."

    intensity_feedback = generate_intensity_feedback(intensity_score)
    energy_feedback = generate_energy_feedback(energy_score)
    variation_feedback = generate_variation_feedback(variation_score)

    dynamic_feedback = (
        f"Additionally, {intensity_feedback} {energy_feedback} {variation_feedback}"
    )

    return base_feedback, dynamic_feedback


def generate_intensity_feedback(intensity_score):
    """Generates feedback based on the intensity score.

    Parameters
    ----------
    intensity_score (float): The intensity score.

    Returns
    -------
    str: Feedback message corresponding to the intensity score.

    """
    if intensity_score >= 85:
        return "Your vocal intensity is excellent, projecting powerfully throughout."
    elif intensity_score >= 70:
        return "Your vocal intensity is very good; a bit more volume variation could add extra impact."
    elif intensity_score >= 55:
        return "Your vocal intensity is moderate; consider projecting more to boost engagement."
    elif intensity_score >= 40:
        return "Your vocal intensity is low; try to speak with greater projection and dynamic volume."
    else:
        return "Your vocal intensity is minimal; significant improvement is needed to capture attention."


def generate_energy_feedback(energy_score):
    """Generates feedback based on the energy score.

    Parameters
    ----------
    energy_score (float): The energy score.

    Returns
    -------
    str: Feedback message corresponding to the energy score.

    """
    if energy_score >= 85:
        return "Your energy level is outstanding, keeping your audience captivated."
    elif energy_score >= 70:
        return "Your energy level is high, though a bit more enthusiasm might further enhance your delivery."
    elif energy_score >= 55:
        return "Your energy level is average; infusing a bit more passion could make your speech more engaging."
    elif energy_score >= 40:
        return "Your energy level is below par; try to be more animated and lively in your delivery."
    else:
        return "Your energy level is very low; work on bringing more vitality and enthusiasm to your speech."


def generate_variation_feedback(variation_score):
    """Generates feedback based on the variation score.

    Parameters
    ----------
    variation_score (float): The variation score.

    Returns
    -------
    str: Feedback message corresponding to the variation score.

    """
    if variation_score >= 85:
        return "Your speech variation is excellent, with seamless shifts in pace and pauses."
    elif variation_score >= 70:
        return "Your speech variation is very good; refining your pacing slightly could further enhance your delivery."
    elif variation_score >= 55:
        return "Your speech variation is moderate; consider incorporating more distinct changes in rhythm and tone."
    elif variation_score >= 40:
        return "Your speech variation is low; try adding more pauses and changes in pace to maintain engagement."
    else:
        return "Your speech variation is minimal; significant adjustments in pacing and delivery are needed."


def analyze_speech_2(audio_path, segment_duration=2.0):
    """Analyzes the speech in an audio file by calculating intensity and energy scores, and generating feedback.

    Parameters
    ----------
    audio_path (str): The path to the audio file.
    segment_duration (float): The duration of each segment in seconds. Default is 2.0 seconds.

    Returns
    -------
    dict: A dictionary containing the final energy score, intensity score, energy score, variation score, base feedback, dynamic feedback, intensity analysis, and energy analysis.

    """
    intensity_data = analyze_intensity(audio_path, segment_duration)
    energy_data = analyze_energy(audio_path, segment_duration)

    intensity_values = list(intensity_data.values())
    energy_values = list(energy_data.values())

    if not intensity_values or not energy_values:
        return {"error": "No valid intensity or energy data detected."}

    intensity_score, energy_score, variation_score, final_energy_score = (
        calculate_scores(intensity_values, energy_values)
    )
    base_feedback, dynamic_feedback = generate_feedback(
        final_energy_score, intensity_score, energy_score, variation_score
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
