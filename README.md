# SayMore Backend - FastAPI Server

## Overview

SayMore is a public speaking and stuttering analysis application that leverages deep learning and speech processing
techniques to assess and improve users' speech quality. This backend, built with FastAPI, provides endpoints for
processing audio files, analyzing speech patterns, and generating personalized feedback.

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

- **Python 3.8+**
- **FastAPI**
- **Firebase setup**
- **Microsoft Azure & Google Cloud APIs**

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-repo/saymore-backend.git
   cd saymore-backend
   ```

2. **Create a virtual environment:**

   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```sh
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

    - Create a `.env` file with the required credentials:
      ```env
      FIREBASE_CREDENTIALS=<your-firebase-credentials-json>
      GOOGLE_APPLICATION_CREDENTIALS_JSON=<your-google-cloud-credentials>
      AZURE_SPEECH_KEY=<your-azure-speech-key>
      AZURE_SPEECH_REGION=<your-azure-region>
      GOOGLE_API_KEY=<your-google-api-key>
      ```

5. **Run the FastAPI server:**

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
  "message": "Backend with the Deep Learning model of the SayMore app----All the variables (GOOGLE_APPLICATION_CREDENTIALS_JSON, FIREBASE_CREDENTIALS, AZURE_SPEECH_KEY, AZURE_SPEECH_REGION, GOOGLE_API_KEY) are set"
}
```

### Speech Analysis Endpoint

```http
POST /test
```

**Request Body:**

- ***Public Speaking test***

```json
{
  "file_name": "recordings/PS_Check/audio123.wav",
  "acc_id": "user_001",
  "test_type": true,
  "lan_flag": "en"
}
```

- ***Stuttering test***

```json
{
  "file_name": "recordings/Stuttering_Check/audio123.wav",
  "acc_id": "user_001",
  "test_type": false,
  "lan_flag": "en"
}
```

**Response:**

- ***Public Speaking test***

```json
{
  "result": {
    "final_public_speaking_score": 50,
    "final_public_speaking_feedback": "final feedback",
    "overall_confidence": 50,
    "transcription": [
      {
        "transcript": "Transcript text",
        "confidence": 50
      }
    ],
    "Voice_Quality_&_Stability_Data": {
      "final_voice_score": 50,
      "variation_score": 50,
      "stability_score": 50,
      "speaking_speed": 50,
      "clarity": 50,
      "overall_jitter_score": 50,
      "overall_shimmer_score": 50,
      "overall_hnr_score": 50,
      "base_feedback": "base feedback",
      "dynamic_feedback": "dynamic feedback",
      "jitter_data": {
        "0.0": 0.03,
        "2.0": 0.03,
        "4.0": 0.03
      },
      "shimmer_data": {
        "0.0": 0.2,
        "2.0": 0.2,
        "4.0": 0.2
      },
      "hnr_data": {
        "0.0": 4,
        "2.0": 4,
        "4.0": 4
      },
      "pitch_data": {
        "0.0": {
          "mean_pitch_ST": 10,
          "median_pitch_ST": 8,
          "min_pitch_ST": 6,
          "max_pitch_ST": 16,
          "std_pitch_ST": 3,
          "pitch_range_ST": 9
        },
        "2.0": {
          "mean_pitch_ST": 10,
          "median_pitch_ST": 8,
          "min_pitch_ST": 6,
          "max_pitch_ST": 16,
          "std_pitch_ST": 3,
          "pitch_range_ST": 9
        },
        "4.0": {
          "mean_pitch_ST": 10,
          "median_pitch_ST": 8,
          "min_pitch_ST": 6,
          "max_pitch_ST": 16,
          "std_pitch_ST": 3,
          "pitch_range_ST": 9
        }
      }
    },
    "Speech_Intensity_&_Energy_Data": {
      "final_energy_score": 50,
      "intensity_score": 50,
      "energy_score": 50,
      "variation_score": 50,
      "base_feedback": "base feedback",
      "dynamic_feedback": "dynamic feedback",
      "intensity_analysis": {
        "0.0": 13,
        "2.0": 17,
        "4.0": 11
      },
      "energy_analysis": {
        "0.0": 226,
        "2.0": 253,
        "4.0": 219
      }
    }
  }
}
```

- ***Stuttering test***

```json
{
  "result": {
    "language": "English",
    "stutter_count": 2,
    "stuttered_words": [
      {
        "word": "you",
        "type": "repetition"
      },
      {
        "word": "be",
        "type": "prolongation"
      }
    ],
    "cluttering_detected": false,
    "fluency_score": 50,
    "stuttering_score": 50,
    "dynamic_feedback": "dynamic feedback",
    "confidence_score": 50,
    "transcript": "Transcript text"
  }
}
```

## Deployment

### Docker

- **Build and run the container**:

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

- **Pamudu Wijesingha (Team Lead)** - Developer
- **Disini Hettige** - Developer
- **Janindu Sandanayaka** - Developer
- **Arani Weerathunga** - Developer
- **Kanila Gunasekara** - Developer
- **Himara Joseph** - Developer

## License

This project is licensed under the MIT License.

