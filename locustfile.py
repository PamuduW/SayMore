from locust import HttpUser, task, between

class SayMoreUser(HttpUser):
    host = "https://saymore-monorepo-8d4fc9b224ef.herokuapp.com"  # Ensure your FastAPI server is running at this URL
    wait_time = between(1, 3)

    @task(1)
    def test_root(self):
        self.client.get("/")

    @task(2)
    def test_audio_analysis(self):
        payload = {
            "file_name": "dummy_audio.wav",
            "acc_id": "user123",
            "test_type": True,
            "lan_flag": "en"
        }
        self.client.post("/test", json=payload)
