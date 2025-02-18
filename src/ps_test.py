import librosa
import numpy as np
import torchaudio
import webrtcvad
import pyworld as pw


def analyze_pitch(audio_path, segment_duration=2.0):
    y, sr = librosa.load(audio_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)

    pitch_data = {}
    num_frames = pitches.shape[1]  # Get number of time frames

    for t in np.arange(0, duration, segment_duration):
        idx = min(int(t * num_frames / duration), num_frames - 1)  # Ensure index is within bounds
        valid_pitches = pitches[:, idx][pitches[:, idx] > 0]

        # Check if valid_pitches is empty
        if valid_pitches.size > 0:
            segment_pitch = np.mean(valid_pitches)  # Compute mean only if non-empty
        else:
            segment_pitch = 0.0  # Default to 0 if no pitch is detected

        pitch_data[int(t)] = float(round(segment_pitch, 2))  # Convert np.float32 → Python float

    return pitch_data


# def analyze_intensity(audio_path, segment_duration=2.0):
#     y, sr = librosa.load(audio_path, sr=None)
#     rms_energy = librosa.feature.rms(y=y)[0]
#     duration = librosa.get_duration(y=y, sr=sr)
#
#     intensity_data = {}
#     frame_length = len(rms_energy) // (duration / segment_duration)
#     for t in np.arange(0, duration, segment_duration):
#         idx = int(t / segment_duration * frame_length)
#         segment_intensity = np.mean(rms_energy[idx:idx + int(frame_length)])
#         intensity_data[int(t)] = round(segment_intensity, 4) if not np.isnan(segment_intensity) else 0
#     return intensity_data
#
# def analyze_formants(audio_path, segment_duration=2.0):
#     y, sr = librosa.load(audio_path, sr=None)
#     duration = librosa.get_duration(y=y, sr=sr)
#     _f0, sp, _ap = pw.wav2world(y.astype(np.float64), sr)
#
#     formant_data = {}
#     for t in np.arange(0, duration, segment_duration):
#         idx = int(t * len(sp) / duration)
#         f1 = np.mean(sp[idx][:50])  # Approximate first formant
#         f2 = np.mean(sp[idx][50:150])  # Approximate second formant
#         f3 = np.mean(sp[idx][150:300])  # Approximate third formant
#         formant_data[int(t)] = {"F1": round(f1, 2), "F2": round(f2, 2), "F3": round(f3, 2)}
#     return formant_data
#
# def analyze_jitter(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     pitches, _ = librosa.piptrack(y=y, sr=sr)
#     pitch_values = pitches[pitches > 0]
#     jitter = np.std(np.diff(pitch_values)) / np.mean(pitch_values) if len(pitch_values) > 1 else 0
#     return round(jitter, 4)
#
# def analyze_shimmer(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     pitches, _ = librosa.piptrack(y=y, sr=sr)
#     pitch_values = pitches[pitches > 0]
#     shimmer = np.std(pitch_values) / np.mean(pitch_values) if len(pitch_values) > 1 else 0
#     return round(shimmer, 4)
#
# def analyze_hnr(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     _f0, sp, ap = pw.wav2world(y.astype(np.float64), sr)
#     hnr = np.mean(10 * np.log10(sp / (ap + 1e-10)))  # Harmonic-to-noise ratio
#     return round(hnr, 2)
#
# def analyze_duration(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     return round(librosa.get_duration(y=y, sr=sr), 2)
#
# def analyze_energy(audio_path, segment_duration=2.0):
#     y, sr = librosa.load(audio_path, sr=None)
#     duration = librosa.get_duration(y=y, sr=sr)
#
#     energy_data = {}
#     for t in np.arange(0, duration, segment_duration):
#         start, end = int(t * sr), int((t + segment_duration) * sr)
#         segment = y[start:end]
#         energy = np.sum(segment ** 2)
#         energy_data[int(t)] = round(energy, 2)
#     return energy_data
#
# def analyze_pause(audio_path):
#     vad = webrtcvad.Vad(2)
#     y, sr = librosa.load(audio_path, sr=16000)  # WebRTC VAD works best at 16kHz
#     frame_length = int(0.03 * sr)  # 30ms frames
#     frames = [y[i:i + frame_length] for i in range(0, len(y), frame_length)]
#     pauses = sum(1 for frame in frames if not vad.is_speech(frame.tobytes(), sr))
#     return pauses
#
# def analyze_volume(audio_path):
#     return analyze_intensity(audio_path)
#
# def analyze_rhythm(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
#     return round(tempo, 2)
#
# def analyze_fluency(audio_path):
#     pauses = analyze_pause(audio_path)
#     return "Fluent" if pauses < 3 else "Non-Fluent"
#
# def analyze_prosody(audio_path):
#     return {
#         "pitch_variation": analyze_pitch(audio_path),
#         "rhythm": analyze_rhythm(audio_path),
#         "intensity_variation": analyze_intensity(audio_path),
#     }
#
# def analyze_clarity(audio_path):
#     return "Clear" if analyze_fluency(audio_path) == "Fluent" else "Unclear"


##########################################################################################
# def analyze_rate(audio_path):
#     num_syllables = analyze_syllable(audio_path)
#     duration = analyze_duration(audio_path)
#     return round(num_syllables / duration, 2)
#
# def analyze_pronunciation(audio_path):
#     return "Requires ML phoneme analysis (DeepSpeech, wav2vec2)"
#
# def analyze_accent(audio_path):
#     return "Accent detection requires ML models (e.g., wav2vec2)"
#
# def analyze_emotion(audio_path):
#     return "Emotion detection requires ML-based analysis"
#
# def analyze_stress(audio_path):
#     return "Stress analysis requires NLP phoneme recognition"
#############################################################################################


def ps_test(audio_path):
    return {
        "Pitch_data": analyze_pitch(audio_path),
        # "Intensity_data": analyze_intensity(audio_path),
        # "Formant_data": analyze_formants(audio_path),
        # "Jitter_data": analyze_jitter(audio_path),
        # "Shimmer_data": analyze_shimmer(audio_path),
        # "HNR_data": analyze_hnr(audio_path),
        # "Duration_data": analyze_duration(audio_path),
        # "Energy_data": analyze_energy(audio_path),
        # "Pause_data": analyze_pause(audio_path),
        # "Volume_data": analyze_volume(audio_path),
        # "Rhythm_data": analyze_rhythm(audio_path),
        # "Prosody_data": analyze_prosody(audio_path),
        # "Fluency_data": analyze_fluency(audio_path),
        # "Clarity_data": analyze_clarity(audio_path),

        # "Rate_data": analyze_rate(audio_path),
        # "Pronunciation_data": analyze_pronunciation(audio_path),
        # "Accent_data": analyze_accent(audio_path),
        # "Emotion_data": analyze_emotion(audio_path),
        # "Stress_data": analyze_stress(audio_path)
    }
