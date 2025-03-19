import json
import os
import tempfile

from dotenv import load_dotenv
from google.cloud import speech

# Load environment variables from a .env file
load_dotenv()

# Retrieve Google Cloud credentials from environment variable
gcs_credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
if gcs_credentials_json is None:
    raise ValueError(
        "GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set."
    )

# Parse the credentials JSON string into a dictionary
credentials_dict = json.loads(gcs_credentials_json)

# Replace escaped newline characters in the private key with actual newlines
private_key = credentials_dict.get("private_key")
if private_key:
    credentials_dict["private_key"] = private_key.replace("\\n", "\n")
else:
    raise ValueError("Private key not found in Google Cloud credentials.")

# Create a temporary file to store the modified credentials
temp_credentials_file = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
temp_credentials_file.write(json.dumps(credentials_dict).encode())
temp_credentials_file.close()

# Set the environment variable to point to the temporary credentials file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_credentials_file.name


def transcribe_gcs(
    gcs_uri: str, long_flag: bool, lan_flag: str
) -> list[dict[str, str]]:
    """Transcribes audio from a Google Cloud Storage URI using Google Cloud Speech-to-Text API.

    Parameters
    ----------
    gcs_uri (str): The URI of the audio file in Google Cloud Storage.
    long_flag (bool): Flag indicating whether to use long-running recognition for longer audio files.
    lan_flag (str): Language flag to specify the language of the audio.

    Returns
    -------
    list[dict[str, str]]: A list of dictionaries containing the transcript and confidence score for each segment.

    """
    try:
        client = speech.SpeechClient()

        # Map language flags to Google Cloud language codes
        language_mapping = {"en": "en-US", "si": "si-LK", "ta": "ta-LK"}
        language_code = language_mapping.get(lan_flag, "en-US")

        audio = speech.RecognitionAudio(uri=gcs_uri)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code=language_code,
            enable_automatic_punctuation=True,
        )

        if long_flag:
            operation = client.long_running_recognize(config=config, audio=audio)
            print("Waiting for long-running operation to complete...")
            response = operation.result(timeout=300)
        else:
            response = client.recognize(config=config, audio=audio)

        result_list = [
            {
                "transcript": result.alternatives[0].transcript,
                "confidence": round(result.alternatives[0].confidence * 100, 2),
            }
            for result in response.results
        ]
        return result_list

    except Exception as e:
        print(f"Error processing audio: {e}")
        return [{"error": str(e)}]
