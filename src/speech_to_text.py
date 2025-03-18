import os

from google.cloud import speech


def transcribe_gcs(
    gcs_uri: str, long_flag: bool, lan_flag: str
) -> list[dict[str, str]]:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
        "saymore-340e9-firebase-adminsdk-aaxo4-2e6ac8d48e.json"
    )

    try:
        client = speech.SpeechClient()

        # Map short language codes to full locales.
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
