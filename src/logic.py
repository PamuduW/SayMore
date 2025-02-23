from Model.stutteringModel import stutter_test
from src.ps_test import ps_test

def analysing_audio(file_name, test_type):
    try:
        if test_type:
            analysis_result = ps_test(file_name)
        else:
            analysis_result = stutter_test(file_name)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}