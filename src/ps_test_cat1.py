import re

import librosa
import numpy as np
import parselmouth


######################################################Voice Quality & Stability####################################################################
# Convert Hz to semitones for normalization
def hz_to_semitones(pitch_hz, reference_pitch=100.0):
    return 12 * np.log2(pitch_hz / reference_pitch)


# Analyze pitch, expressiveness, and provide a Monotony Score
def analyze_pitch(audio_path, segment_duration=2.0):
    try:
        snd = parselmouth.Sound(audio_path)
        duration = snd.get_total_duration()
        pitch = snd.to_pitch()
        pitch_values = pitch.selected_array["frequency"]
        time_stamps = pitch.xs()

        # Remove unvoiced segments
        voiced_indices = pitch_values > 0
        pitch_values = pitch_values[voiced_indices]
        time_stamps = time_stamps[voiced_indices]

        if pitch_values.size == 0:
            return {"error": "No voiced pitch detected."}

        semitone_values = hz_to_semitones(pitch_values)
        overall_std = np.std(semitone_values)
        overall_range = np.max(semitone_values) - np.min(semitone_values)
        monotony_score = 100 * (1 - (overall_std / (overall_range + 1e-5)))
        monotony_score = max(0, min(100, round(monotony_score, 2)))

        feedback = (
            "Great job! Your voice is dynamic and expressive!"
            if monotony_score > 70
            else (
                "You're doing well! Slightly more pitch variation will improve engagement."
                if monotony_score > 30
                else "Your speech sounds too monotone. Try adding more variation to your pitch!"
            )
        )

        pitch_data = {}
        for t in np.arange(0, duration, segment_duration):
            segment_indices = (time_stamps >= t) & (
                time_stamps < t + segment_duration
            )
            segment_pitches = semitone_values[segment_indices]

            if segment_pitches.size > 0:
                pitch_data[round(t, 2)] = {
                    "mean_pitch_ST": float(round(np.mean(segment_pitches), 2)),
                    "median_pitch_ST": float(
                        round(np.median(segment_pitches), 2)
                    ),
                    "min_pitch_ST": float(round(np.min(segment_pitches), 2)),
                    "max_pitch_ST": float(round(np.max(segment_pitches), 2)),
                    "std_pitch_ST": float(round(np.std(segment_pitches), 2)),
                    "pitch_range_ST": float(
                        round(
                            np.max(segment_pitches) - np.min(segment_pitches), 2
                        )
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
            "feedback": feedback,
            "pitch_analysis": pitch_data,
        }

    except Exception as e:
        return {"error": str(e)}


def analyze_jitter(audio_path, segment_duration=2.0):
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
        jitter_data[float(round(t, 2))] = jitter_value

    overall_jitter = np.nan_to_num(np.mean(list(jitter_data.values())))
    return {"jitter_data": jitter_data, "overall_jitter": overall_jitter}


def analyze_shimmer(audio_path, segment_duration=2.0):
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
            float(round(shimmer_local, 4))
            if not np.isnan(shimmer_local)
            else 0.0
        )
        shimmer_data[float(round(t, 2))] = shimmer_value

    overall_shimmer = np.nan_to_num(np.mean(list(shimmer_data.values())))
    return {"shimmer_data": shimmer_data, "overall_shimmer": overall_shimmer}


def analyze_hnr(audio_path, segment_duration=2.0):
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

        hnr_value = max(float(round(hnr_value, 2)), 0.0)
        hnr_data[float(round(t, 2))] = hnr_value

    overall_hnr = np.mean(list(hnr_data.values()))
    return {"hnr_data": hnr_data, "overall_hnr": overall_hnr}


# Analyze speaking speed
def analyze_speaking_speed(audio_path, text):
    y, sr = librosa.load(audio_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)
    transcript = text
    words = len(re.findall(r"\b\w+\b", transcript))
    words_per_minute = words / (duration / 60)
    return round(words_per_minute, 2)


# Analyze clarity (using formant frequency dispersion)
def analyze_clarity(audio_path):
    snd = parselmouth.Sound(audio_path)
    formants = snd.to_formant_burg()
    f1 = np.mean(
        [
            formants.get_value_at_time(1, t)
            for t in np.arange(0, snd.get_total_duration(), 0.01)
            if formants.get_value_at_time(1, t) is not None
        ]
    )
    f2 = np.mean(
        [
            formants.get_value_at_time(2, t)
            for t in np.arange(0, snd.get_total_duration(), 0.01)
            if formants.get_value_at_time(2, t) is not None
        ]
    )
    clarity_score = 100 - abs(f1 - f2) / 20  # Normalize clarity score
    return max(0, min(100, round(clarity_score, 2)))


# Generate final public speaking score
def generate_speaking_score(
    monotony_score, speaking_speed, clarity, jitter, shimmer, hnr
):
    weights = {
        "monotony": 0.25,
        "speed": 0.25,
        "clarity": 0.25,
        "stability": 0.25,
    }

    # Fix stability score calculation
    stability_score = 100 - ((jitter * 100) + (shimmer * 100) - (hnr * 2))
    stability_score = max(
        0, min(100, round(stability_score, 2))
    )  # Clamp to 0-100

    # Fix speaking speed scaling
    speed_score = min(100, (speaking_speed / 150) * 100)  # Normalize to 100 max

    # Fix final score summation logic
    final_score = (
        (monotony_score * weights["monotony"])
        + (speed_score * weights["speed"])
        + (clarity * weights["clarity"])
        + (stability_score * weights["stability"])
    )

    return max(0, min(100, round(final_score, 2)))  # Clamp between 0-100


# Main function to analyze speech
def analyze_speech_1(audio_path, text):
    pitch_data = analyze_pitch(audio_path)
    speaking_speed = analyze_speaking_speed(audio_path, text)
    clarity = analyze_clarity(audio_path)
    jitter_data = analyze_jitter(audio_path)
    shimmer_data = analyze_shimmer(audio_path)
    hnr_data = analyze_hnr(audio_path)

    if "error" in pitch_data:
        return {"error": pitch_data["error"]}

    final_score = generate_speaking_score(
        pitch_data["monotony_score"],
        speaking_speed,
        clarity,
        jitter_data["overall_jitter"],
        shimmer_data["overall_shimmer"],
        hnr_data["overall_hnr"],
    )

    return {
        "final_public_speaking_score": final_score,
        "monotony_score": pitch_data["monotony_score"],
        "feedback": pitch_data["feedback"],
        "speaking_speed": speaking_speed,
        "clarity": clarity,
        "jitter": jitter_data,
        "shimmer": shimmer_data,
        "hnr": hnr_data,
        "pitch_analysis": pitch_data["pitch_analysis"],
    }


##########################################################################################################################


#########################################################################################################################
# def analyze_duration(audio_path):
#     y, sr = librosa.load(audio_path, sr=None)
#     return float(round(librosa.get_duration(y=y, sr=sr), 2))
#
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
