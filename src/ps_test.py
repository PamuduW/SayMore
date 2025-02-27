import librosa
import numpy as np
import torchaudio
import webrtcvad
import pyworld as pw
import parselmouth

############################################################################################
def analyze_pitch(audio_path, segment_duration=2.0):
    # Load the audio file
    snd = parselmouth.Sound(audio_path)
    duration = snd.get_total_duration()

    # Extract pitch data
    pitch = snd.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    time_stamps = pitch.xs()  # Get time values for each pitch frame

    # Remove unvoiced segments (where pitch is 0)
    voiced_indices = pitch_values > 0
    pitch_values = pitch_values[voiced_indices]
    time_stamps = time_stamps[voiced_indices]

    if pitch_values.size == 0:
        return {"error": "No voiced pitch detected."}

    # Segment-wise pitch analysis
    pitch_data = {}
    for t in np.arange(0, duration, segment_duration):
        segment_indices = (time_stamps >= t) & (time_stamps < t + segment_duration)
        segment_pitches = pitch_values[segment_indices]

        if segment_pitches.size > 0:
            pitch_data[round(t, 2)] = {
                "mean_pitch": float(round(np.mean(segment_pitches), 2)),
                "median_pitch": float(round(np.median(segment_pitches), 2)),
                "min_pitch": float(round(np.min(segment_pitches), 2)),
                "max_pitch": float(round(np.max(segment_pitches), 2)),
                "std_pitch": float(round(np.std(segment_pitches), 2))
            }
        else:
            pitch_data[round(t, 2)] = {
                "mean_pitch": 0.0,
                "median_pitch": 0.0,
                "min_pitch": 0.0,
                "max_pitch": 0.0,
                "std_pitch": 0.0
            }

    return pitch_data

# def analyze_jitter(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     pitches, _ = librosa.piptrack(y=y, sr=sr)
#     pitch_values = pitches[pitches > 0]
#     jitter = np.std(np.diff(pitch_values)) / np.mean(pitch_values) if len(pitch_values) > 1 else 0
#     return float(round(jitter, 4))

# def analyze_shimmer(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     pitches, _ = librosa.piptrack(y=y, sr=sr)
#     pitch_values = pitches[pitches > 0]
#     shimmer = np.std(pitch_values) / np.mean(pitch_values) if len(pitch_values) > 1 else 0
#     return float(round(shimmer, 4))

# def analyze_hnr(audio_path):
#     snd = parselmouth.Sound(audio_path)
#     hnr = snd.get_hnr()
#     return float(round(hnr, 2))


############################################################################################
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
#         intensity_data[int(t)] = float(round(segment_intensity, 4)) if not np.isnan(segment_intensity) else 0
#     return intensity_data
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
#         energy_data[int(t)] = float(round(energy, 2))
#     return energy_data
#
# def analyze_volume(audio_path):
#     return analyze_intensity(audio_path)
#
#
# #############################################################################################
# def analyze_duration(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     return float(round(librosa.get_duration(y=y, sr=sr), 2))
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

# def analyze_pause(audio_path):
#     vad = webrtcvad.Vad(2)
#     y, sr = librosa.load(audio_path, sr=16000)  # WebRTC VAD works best at 16kHz
#     frame_length = int(0.03 * sr)  # 30ms frames
#     frames = [y[i:i + frame_length] for i in range(0, len(y), frame_length)]
#
#     print("aaa")
#     pauses = 0
#     for frame in frames:
#         try:
#             print("bbbb")
#             if not vad.is_speech(frame.tobytes(), sr):
#                 print("cccc")
#                 pauses += 1
#         except Exception as e:
#             return {"result": {"error": f"Error while processing frame: {str(e)}"}}
#
#     return pauses

# def analyze_rhythm(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
#     return float(round(tempo, 2))
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
        # Voice Quality & Stability
        "Pitch_data": analyze_pitch(audio_path),
        # "Jitter_data": analyze_jitter(audio_path),
        # "Shimmer_data": analyze_shimmer(audio_path),
        # "HNR_data": analyze_hnr(audio_path),

        # # Speech Intensity & Energy
        # "Intensity_data": analyze_intensity(audio_path),
        # "Energy_data": analyze_energy(audio_path),
        # "Volume_data": analyze_volume(audio_path),
        #
        # # Speech Timing & Rhythm
        # "Duration_data": analyze_duration(audio_path),
        #
        # # Advanced Prosodic & Fluency Analysis
        # "Formant_data": analyze_formants(audio_path),

        # "Pause_data": analyze_pause(audio_path),
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
