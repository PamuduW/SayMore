# SayMore Backend - FastAPI Server

## Overview

SayMore is a public speaking and stuttering analysis application that leverages deep learning and speech processing techniques to assess and improve users' speech quality. This backend, built with FastAPI, provides endpoints for processing audio files, analyzing speech patterns, and generating personalized feedback.

## Features

- **Public Speaking Analysis**: Evaluates speech clarity, articulation, intensity, monotony, and energy levels.
- **Stuttering Detection**: Identifies repetitions, prolongations, blocks, and cluttering in speech.
- **Speech Transcription**: Utilizes Microsoft Azure and Google Cloud APIs for speech-to-text conversion.
- **Personalized Feedback**: Provides dynamic suggestions for improving speech delivery.
- **Firebase Integration**: Manages user data and analysis results with Firebase Firestore and Cloud Storage.

## Project Structure

```
SayMore/
│── src/                         # Source code directory
│   ├── logic.py                 # Core logic for speech analysis
│   ├── ps_test.py               # Public speaking test logic
│   ├── ps_test_cat1.py          # Category 1 - Voice quality & stability analysis
│   ├── ps_test_cat2.py          # Category 2 - Speech intensity & energy analysis
│   ├── speech_to_text.py        # Speech-to-text processing (Google/Azure API)
│   ├── stutter_test.py          # Stuttering detection logic
│
│── .blackignore                 # Black formatter ignore rules
│── .gitattributes               # Git configuration for file handling
│── .gitignore                   # Specifies files to ignore in version control
│── .isort.cfg                   # isort configuration for import sorting
│── .ruffignore                  # Ruff linter ignore rules
│── Dockerfile                   # Docker setup for containerization
│── FirstRun.txt                 # Possibly a guide for first-time setup
│── heroku.yml                   # Configuration file for deploying to Heroku
│── main.py                      # FastAPI entry point (backend server)
│── Makefile                     # Build automation script
│── pyproject.toml               # Project dependencies and settings (PEP 518)
│── README.md                    # Documentation for the project
│── requirements.txt             # Python dependencies list
│── runtime.txt                  # Specifies runtime version for deployment (e.g., Heroku)

```

## Installation

### Prerequisites

- Python 3.8+
- FastAPI
- Firebase setup
- Microsoft Azure & Google Cloud APIs

### Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/saymore-backend.git
   cd saymore-backend
   ```

2. Create a virtual environment:

   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:

   ```sh
   pip install -r requirements.txt
   ```

4. Set up environment variables:

    - Create a `.env` file with the required credentials:
      ```env
      FIREBASE_CREDENTIALS=<your-firebase-credentials-json>
      GOOGLE_APPLICATION_CREDENTIALS_JSON=<your-google-cloud-credentials>
      AZURE_SPEECH_KEY=<your-azure-speech-key>
      AZURE_SPEECH_REGION=<your-azure-region>
      GOOGLE_API_KEY=<your-google-api-key>
      ```

5. Run the FastAPI server:

   ```sh
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Root Endpoint

```http
GET /
```

**Response:**

```json
{
  "message": "Backend with the Deep Learning model of the SayMore app"
}
```

### Speech Analysis Endpoint

```http
POST /test
```

**Request Body:**

```json
{
  "file_name": "audio123.wav",
  "acc_id": "user_001",
  "test_type": true,
  "lan_flag": "en"
}
```

**Response:**

```json
{
  "result": {
    "final_public_speaking_score": 85.3,
    "final_public_speaking_feedback": "Excellent performance!",
    "transcription": "Your transcribed text...",
    "voice_analysis": { ... },
    "energy_analysis": { ... }
  }
}
```

## Deployment

### Docker

Build and run the container:

```sh
docker build -t saymore-backend .
docker run -p 8000:8000 saymore-backend
```

### Heroku

1. Log in to Heroku and create an app:
   ```sh
   heroku login
   heroku create saymore-backend
   ```
2. Deploy using Heroku CLI:
   ```sh
   git push heroku main
   ```

## Contributors

- **Your Name** - Developer

## License

This project is licensed under the MIT License.

