from src.logic import analysing_audio

def fake_ps_test(file_name, lan_flag):
    return {"final_public_speaking_score": 90}

def fake_stutter_test(file_name, lan_flag):
    return {"stutter_score": 75}

def test_analysing_audio_ps_test(monkeypatch):
    monkeypatch.setattr("src.logic.ps_test", fake_ps_test)
    result = analysing_audio("dummy_audio.wav", True, "en")
    assert result["final_public_speaking_score"] == 90

def test_analysing_audio_stutter_test(monkeypatch):
    monkeypatch.setattr("src.logic.stutter_test", fake_stutter_test)
    result = analysing_audio("dummy_audio.wav", False, "en")
    assert result["stutter_score"] == 75
