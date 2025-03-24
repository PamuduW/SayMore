from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    # Check for welcome message and environment variable check text
    assert "Backend with the Deep Learning model" in data["message"]
