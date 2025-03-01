import librosa
import numpy as np
import torch
import torch.nn as nn


# Define your model architecture
class StutterDetector(nn.Module):
    def __init__(self, input_size):
        super(StutterDetector, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(input_size, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 2),
        )

    def forward(self, x):
        return self.fc(x)


# Initialize the model and load the state dictionary
model = StutterDetector(40)
model.load_state_dict(
    torch.load("Model/stutter_detector.pth", weights_only=True)
)
model.eval()


def stutter_test(local_file):
    try:
        audio, sample_rate = librosa.load(local_file, sr=16000)
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        mfccs_mean = np.mean(mfccs.T, axis=0)

        input_tensor = torch.tensor(mfccs_mean, dtype=torch.float32).unsqueeze(
            0
        )
        with torch.no_grad():
            output = model(input_tensor)
            prediction = torch.argmax(output, dim=1).item()

        out_string = "Stutter" if prediction == 1 else "No Stutter"

        return {"Prediction": out_string, "confidence": 0.8}
    except Exception as e:
        return {"error": str(e)}
