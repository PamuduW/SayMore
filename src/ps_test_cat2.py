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
            intensity_data[float(round(t, 2))] = float(round(segment_intensity * 100, 4))  # Normalize (0-100)
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
            log_energy = np.log10(energy + 1e-8)  # Convert to dB-like scale
            energy_data[float(round(t, 2))] = float(round(log_energy * 10, 2))  # Normalize (0-100)
        else:
            energy_data[float(round(t, 2))] = 0.0  # Handle empty segment case

    return energy_data


def analyze_speech_2(audio_path, segment_duration=2.0):
    intensity_data = analyze_intensity(audio_path, segment_duration)
    energy_data = analyze_energy(audio_path, segment_duration)

    intensity_values = list(intensity_data.values())
    energy_values = list(energy_data.values())

    if all(v == 0 for v in intensity_values) and all(v == 0 for v in energy_values):
        return {"error": "No meaningful speech intensity or energy detected. Ensure audio is clear and loud enough."}

    # Calculate overall intensity & energy score
    avg_intensity = np.mean(intensity_values)
    avg_energy = np.mean(energy_values)

    # Calculate variation to measure expressiveness
    intensity_variation = np.std(intensity_values)
    energy_variation = np.std(energy_values)

    # Normalize final scores (0-100)
    intensity_score = float(round(np.clip(avg_intensity, 0, 100), 2))
    energy_score = float(round(np.clip(avg_energy, 0, 100), 2))
    variation_score = float(round(np.clip((intensity_variation + energy_variation) * 5, 0, 100), 2))

    # Interpretation & feedback
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
