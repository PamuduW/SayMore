from google.cloud import speech
import os


# gcs_uri = f"gs://saymore-340e9.firebasestorage.app/{audio_path}"

def transcribe_gcs(gcs_uri: str, long_flag, lan_flag) -> list[dict[str, str]]:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "saymore-340e9-firebase-adminsdk-aaxo4-2e6ac8d48e.json"

    client = speech.SpeechClient()

    if lan_flag == "en":
        first_language = "en-US"
    elif lan_flag == "si":
        first_language = "si-LK"
    else:
        first_language = "ta-LK"

    # alternate_languages = ["en-US"]
    audio = speech.RecognitionAudio(uri=gcs_uri)
    config = speech.RecognitionConfig(
        # encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
        # sample_rate_hertz=44100,
        language_code=first_language,
        # alternative_language_codes=alternate_languages,
    )

    if long_flag:
        operation = client.long_running_recognize(config=config, audio=audio)
        print("Waiting for operation to complete...")
        response = operation.result(timeout=300)
    else:
        response = client.recognize(config=config, audio=audio)

    # Convert the response to a JSON-serializable format
    result_list = []
    for i, result in enumerate(response.results):
        alternative = result.alternatives[0]
        result_list.append({
            "transcript": alternative.transcript,
            "confidence": alternative.confidence
        })

    return result_list
