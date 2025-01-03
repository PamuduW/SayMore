import uuid
import torch
import librosa
import numpy as np
from firebase_admin import storage

# model = torch.load("path/to/your/model.pth")
# model.eval()

def analyze_audio(local_file):
    try:
        y, sr = librosa.load(local_file, sr=16000)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)

        analysis_id = str(uuid.uuid4())

        return {analysis_id: {"stuttering": True, "confidence": 0.8}},mfccs
    except Exception as e:
        return {"error": str(e)}
