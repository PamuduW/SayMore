import librosa
import numpy as np


#######################################################Speech Intensity & Energy###################################################################
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
            intensity_data[float(round(t, 2))] = float(round(segment_intensity * 200, 4))  # Normalize (0-100)
        else:
            intensity_data[float(round(t, 2))] = 0.0  # Handle empty segment case

    return intensity_data


def analyze_energy(audio_path, segment_duration=2.0):
    y, sr = librosa.load(audio_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)

    energy_data = {}
    for t in np.arange(0, duration, segment_duration):
        start, end = int(t * sr), min(int((t + segment_duration) * sr), len(y))  # Avoid OOB index
        segment = y[start:end]

        if segment.size > 0:
            energy = np.sum(segment ** 2)
            log_energy = max(np.log10(energy + 1e-8) * 10, 0)  # Convert to dB-like scale
            energy_data[float(round(t, 2))] = float(round(log_energy * 10, 2))  # Normalize (0-100)
        else:
            energy_data[float(round(t, 2))] = 0.0  # Handle empty segment case

    return energy_data


def analyze_speech_2(audio_path, segment_duration=2.0):
    intensity_data = analyze_intensity(audio_path, segment_duration)
    energy_data = analyze_energy(audio_path, segment_duration)

    intensity_values = list(intensity_data.values())
    energy_values = list(energy_data.values())

    if not intensity_values or not energy_values:
        return {"error": "No valid intensity or energy data detected."}

    # Calculate overall intensity & energy
    avg_intensity = np.mean(intensity_values)
    avg_energy = np.mean(energy_values)

    # Calculate variation (expressiveness)
    intensity_variation = np.std(intensity_values)
    energy_variation = np.std(energy_values)

    max_possible_energy = 250
    normalized_energy = (avg_energy / max_possible_energy) * 100
    energy_score = float(round(np.clip(normalized_energy, 5, 100), 2))

    scaled_intensity = np.log1p(avg_intensity * 20) * 10
    intensity_score = float(round(np.clip(scaled_intensity, 5, 100), 2))

    max_variation = 50  # Keep this as the reference max
    normalized_variation = np.log1p((intensity_variation + energy_variation) / max_variation) * 100
    variation_score = float(round(np.clip(normalized_variation, 5, 100), 2))

    if variation_score > 50:
        feedback = "Great job! Your speech has dynamic intensity and energy, making it engaging."
    elif variation_score > 25:
        feedback = "You're doing well, but adding more intensity variation will improve engagement."
    else:
        feedback = "Your speech lacks variation. Try emphasizing key points with more energy shifts."

    return {
        "intensity_score": intensity_score,
        "energy_score": energy_score,
        "variation_score": variation_score,
        "feedback": feedback,
        "intensity_analysis": intensity_data,
        "energy_analysis": energy_data
    }

##########################################################################################################################
