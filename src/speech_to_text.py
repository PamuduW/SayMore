import os
import json
import tempfile
from google.cloud import speech
from dotenv import load_dotenv

load_dotenv()

gcs_credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
if gcs_credentials_json is None:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set.")

credentials_dict = json.loads(gcs_credentials_json)

private_key = credentials_dict.get("private_key")
if private_key:
    credentials_dict["private_key"] = private_key.replace("\\n", "\n")
else:
    raise ValueError("Private key not found in Google Cloud credentials.")

temp_credentials_file = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
temp_credentials_file.write(json.dumps(credentials_dict).encode())
temp_credentials_file.close()

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_credentials_file.name

def transcribe_gcs(gcs_uri: str, long_flag: bool, lan_flag: str) -> list[dict[str, str]]:
    try:
        client = speech.SpeechClient()

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
