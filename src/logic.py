from Model.stutteringModel import stutter_test
from src.ps_test_cat1 import analyze_speech_1
from src.ps_test_cat2 import analyze_speech_2
from src.speech_to_text import transcribe_gcs


def analysing_audio(file_name, test_type):
    try:
        if test_type:
            analysis_result = ps_test(file_name)
        else:
            analysis_result = stutter_test(file_name)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}


def ps_test(audio_path):
    gcs_uri = f"gs://saymore-340e9.firebasestorage.app/{audio_path}"
    return {
        # "Voice Quality & Stability Data": analyze_speech_1(audio_path),
        # "Speech Intensity & Energy Data": analyze_speech_2(audio_path)
        "text": transcribe_gcs(gcs_uri,True)
    }
