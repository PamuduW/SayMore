from src.ps_test import ps_test
from src.stutter_test import stutter_test


def analysing_audio(file_name, test_type, lan_flag):
    """Analyzes an audio file based on the specified test type.

    Parameters
    ----------
    file_name (str): The name of the audio file to be analyzed.
    test_type (bool): The type of test to perform. If True, perform ps_test; otherwise, perform stutter_test.
    lan_flag (str): The language flag to be used in the ps_test.

    Returns
    -------
    dict: The result of the analysis or an error message if an exception occurs.

    """
    try:
        if test_type:
            analysis_result = ps_test(file_name, lan_flag)
        else:
            analysis_result = stutter_test(file_name)
        if "error" in analysis_result:
            logging.error("Error during audio analysis: %s", analysis_result["error"])
            return {"error": "An internal error has occurred during audio analysis."}
        return analysis_result
    except Exception as e:
        logging.error("Error during audio analysis: %s", str(e))
        return {"error": "An internal error has occurred during audio analysis."}
