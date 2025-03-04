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
