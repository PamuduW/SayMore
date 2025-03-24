import os
from firebase_admin import storage
from fastapi.testclient import TestClient
from main import app, db  # Import the app and db from your main module

client = TestClient(app)

# Fake classes to simulate Firebase Storage behavior
class FakeBlob:
    def download_to_filename(self, filename):
        # Create a dummy file locally so that subsequent operations succeed
        with open(filename, "w") as f:
            f.write("dummy content")
    def delete(self):
        # Simulate blob deletion; do nothing
        pass

class FakeBucket:
    def blob(self, file_name):
        return FakeBlob()

# Fake classes to simulate Firestore behavior
class FakeDocRef:
    def update(self, data):
        # Simply pass to simulate a successful update
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

def test_test_endpoint(monkeypatch):
    # Monkeypatch the analysing_audio function
    monkeypatch.setattr("src.logic.analysing_audio", fake_analysing_audio)
    # Monkeypatch the storage.bucket() to use our FakeBucket
    monkeypatch.setattr(storage, "bucket", lambda: FakeBucket())
    # Monkeypatch the Firestore client in main to use our FakeDB
    monkeypatch.setattr("main.db", FakeDB())

    # Prepare a dummy request payload
    payload = {
        "file_name": "dummy_audio.wav",
        "acc_id": "user123",
        "test_type": True,
        "lan_flag": "en"
    }

    response = client.post("/test", json=payload)
    # Clean up dummy file if it exists
    if os.path.exists("dummy_audio.wav"):
        os.remove("dummy_audio.wav")

    assert response.status_code == 200
    result = response.json()
    assert "result" in result
    assert result["result"]["final_public_speaking_score"] == 85
