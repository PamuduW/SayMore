from src.ps_test import ps_test
from src.stutter_test import stutter_test


def analysing_audio(file_name, test_type, lan_flag):
    try:
        if test_type:
            analysis_result = ps_test(file_name, lan_flag)
        else:
            analysis_result = stutter_test(file_name)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}
