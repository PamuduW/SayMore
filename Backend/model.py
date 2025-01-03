import torch
import librosa
import numpy as np
from firebase_admin import storage

# model = torch.load("path/to/your/model.pth")
# model.eval()

def analyze_audio(file_id, aud_file):
    try:
        # if not file.filename.endswith('.wav'):
        #     return {"error": "Invalid file format. Only .wav files are supported."}
        #
        # y, sr = librosa.load(file, sr=16000)
        # mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        #
        # print(mfccs)
        print(type(aud_file))
        return {file_id: {"stuttering": True, "confidence": 0.8}}
    except Exception as e:
        return {"error": str(e)}
