import librosa
import numpy as np
import torch
from safetensors.torch import load_file

# Load the model
MODEL_PATH = r"D:\Downloads\model.safetensors"


class StutteringDetectionModel(torch.nn.Module):
    def __init__(self):
        super(StutteringDetectionModel, self).__init__()
        self.layer1 = torch.nn.Linear(128, 64)  # Example architecture
        self.layer2 = torch.nn.Linear(64, 3)  # Assuming 3 stuttering types

    def forward(self, x):
        x = torch.relu(self.layer1(x))
        return self.layer2(x)


# Initialize and load model
model = StutteringDetectionModel()
state_dict = load_file(MODEL_PATH)
model.load_state_dict(state_dict, strict=False)  # Allow partial loading
model.eval()


# Function to extract MFCC features
def extract_mfcc(audio_path):
    y, sr = librosa.load(audio_path, sr=16000)  # Load audio
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=128)  # Extract MFCCs
    mfcc = np.mean(mfcc, axis=1)  # Take mean across time axis
    return torch.tensor(mfcc, dtype=torch.float32).unsqueeze(0)  # Add batch dimension


# Function to predict stuttering type
def predict_stuttering(audio_path):
    input_tensor = extract_mfcc(audio_path)
    with torch.no_grad():
        output = model(input_tensor)
        predicted_class = torch.argmax(output, dim=1).item()

    class_labels = ["Beginning Stutter", "Middle Stutter", "End Stutter"]
    return class_labels[predicted_class]


if __name__ == "__main__":
    AUDIO_PATH = r"D:\Downloads\d\harvard.wav"
    prediction = predict_stuttering(AUDIO_PATH)
    print(f"Predicted Stuttering Type: {prediction}")
