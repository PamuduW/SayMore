import librosa
import numpy as np
import torch
import requests
import json

# Set up Hugging Face API details
HUGGING_FACE_API_TOKEN = "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"
MODEL_ID = "HareemFatima/distilhubert-finetuned-stutterdetection"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
HEADERS = {"Authorization": f"Bearer {HUGGING_FACE_API_TOKEN}"}

# Function to extract MFCC features
def extract_mfcc(audio_path):
    y, sr = librosa.load(audio_path, sr=16000)  # Load audio
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=128)  # Extract MFCCs
    mfcc = np.mean(mfcc, axis=1)  # Take mean across time axis
    return mfcc.tolist()  # Convert to list for JSON serialization

# Function to predict stuttering type using Hugging Face API
def predict_stuttering(audio_path):
    input_data = {"inputs": extract_mfcc(audio_path)}
    response = requests.post(API_URL, headers=HEADERS, json=input_data)

    if response.status_code == 200:
        predictions = response.json()
        predicted_class = np.argmax(predictions)  # Assuming output is a list of probabilities
        class_labels = ["Beginning Stutter", "Middle Stutter", "End Stutter"]
        return class_labels[predicted_class]
    else:
        return f"Error: {response.status_code}, {response.text}"

if __name__ == "__main__":
    AUDIO_PATH = r"D:\One Drive\OneDrive - University of Westminster\SDGP\ML Recs\Basic\New folder\U_ID_2+00308169-b37b-4b9f-aed5-b7dd6420gama.wav"
    prediction = predict_stuttering(AUDIO_PATH)
    print(f"Predicted Stuttering Type: {prediction}")
