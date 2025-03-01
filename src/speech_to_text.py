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

        # Language mapping with default fallback
        language_mapping = {"en": "en-US", "si": "si-LK", "ta": "ta-LK"}
        first_language = language_mapping.get(
            lan_flag, "en-US"
        )  # Default to English if unknown

        # Set up audio config
        audio = speech.RecognitionAudio(uri=gcs_uri)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,  # Ensuring correct encoding for WAV files
            sample_rate_hertz=16000,
            language_code=first_language,
            enable_automatic_punctuation=True,
        )

        # Choose recognition mode based on file length
        if long_flag:
            operation = client.long_running_recognize(config=config, audio=audio)
            print("Waiting for operation to complete...")
            response = operation.result(timeout=300)
        else:
            response = client.recognize(config=config, audio=audio)

        # Convert the response to a JSON-serializable format
        result_list = [
            {
                "transcript": result.alternatives[0].transcript,
                "confidence": round(
                    result.alternatives[0].confidence * 100, 2
                ),  # Convert confidence to percentage
            }
            for result in response.results
        ]

        return result_list

    except Exception as e:
        print(f"Error processing audio: {e}")
        return [{"error": str(e)}]
