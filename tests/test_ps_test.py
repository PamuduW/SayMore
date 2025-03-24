import os
from firebase_admin import storage
from fastapi.testclient import TestClient
from main import app
from src.logic import analysing_audio

client = TestClient(app)

# Fake classes to simulate Firebase Storage behavior
class FakeBlob:
    def download_to_filename(self, filename):
        # Create a dummy file locally (it can be empty or contain dummy audio data)
        with open(filename, "w") as f:
            f.write("dummy content")
    def delete(self):
        pass

class FakeBucket:
    def blob(self, file_name):
        return FakeBlob()

# Fake classes to simulate Firestore behavior
class FakeDocRef:
    def update(self, data):
        pass

class FakeCollection:
    def document(self, doc_id):
        return FakeDocRef()

class FakeDB:
    def collection(self, name):
        return FakeCollection()

# Fake analysis function to bypass real audio analysis
def fake_analysing_audio(file_name, test_type, lan_flag):
    return {"final_public_speaking_score": 85, "final_public_speaking_feedback": "Test feedback"}

# Fake transcription function to bypass external API call
def fake_transcribe_gcs(gcs_uri, long_flag, lan_flag):
    # Return a dummy transcription result.
    return [{"transcript": "dummy transcript", "confidence": 1.0}]

def test_test_endpoint(monkeypatch):
    # Monkeypatch the analysing_audio function
    monkeypatch.setattr("src.logic.analysing_audio", fake_analysing_audio)
    # Monkeypatch Firebase storage bucket
    monkeypatch.setattr(storage, "bucket", lambda: FakeBucket())
    # Monkeypatch Firestore client in main to use FakeDB
    monkeypatch.setattr("main.db", FakeDB())
    # Patch the transcription function in the namespace where it was imported in ps_test
    monkeypatch.setattr("src.ps_test.transcribe_gcs", fake_transcribe_gcs)

    payload = {
        "file_name": "dummy_audio.wav",
        "acc_id": "user123",
        "test_type": True,
        "lan_flag": "en"
    }

    response = client.post("/test", json=payload)
    if os.path.exists("dummy_audio.wav"):
        os.remove("dummy_audio.wav")

    assert response.status_code == 200
    result = response.json()
    assert "result" in result
    assert result["result"]["final_public_speaking_score"] == 85
