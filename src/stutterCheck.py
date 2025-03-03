import requests

# Set up Hugging Face API details
HUGGING_FACE_API_TOKEN = "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"
MODEL_ID = "HareemFatima/distilhubert-finetuned-stutterdetection"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
HEADERS = {"Authorization": f"Bearer {HUGGING_FACE_API_TOKEN}"}

# Function to read and send raw audio to Hugging Face
def predict_stuttering(audio_path):
    with open(audio_path, "rb") as audio_file:
        audio_data = audio_file.read()  # Read the raw WAV file as bytes

    response = requests.post(API_URL, headers=HEADERS, data=audio_data)  # Send raw audio

    if response.status_code == 200:
        predictions = response.json()
        return predictions  # Adjust based on model output format
    else:
        return f"Error: {response.status_code}, {response.text}"

if __name__ == "__main__":
    AUDIO_PATH = r"D:\One Drive\OneDrive - University of Westminster\SDGP\ML Recs\Basic\New folder\U_ID_2+00308169-b37b-4b9f-aed5-b7dd6420ceba.wav"
    prediction = predict_stuttering(AUDIO_PATH)
    print(f"Predicted Stuttering Type: {prediction}")
