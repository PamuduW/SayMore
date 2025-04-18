import json
import logging
import os
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from firebase_admin import credentials, firestore, initialize_app, storage
from pydantic import BaseModel

from src.logic import analysing_audio

# Load environment variables from a .env file
load_dotenv()
logging.basicConfig(level=logging.ERROR)
# Initialize FastAPI app
app = FastAPI()

# Get Firebase credentials from environment variable
firebase_credentials_json = os.getenv("FIREBASE_CREDENTIALS")

# Raise an error if the Firebase credentials are not set
if firebase_credentials_json is None:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is not set")

# Load Firebase credentials from JSON
firebase_credentials = json.loads(firebase_credentials_json)

# Replace escaped newline characters in the private key
private_key = firebase_credentials.get("private_key")
if private_key:
    firebase_credentials["private_key"] = private_key.replace("\\n", "\n")
else:
    raise ValueError("Private key not found in Firebase credentials")

# Initialize Firebase app with credentials
cred = credentials.Certificate(firebase_credentials)
initialize_app(cred, {"storageBucket": "saymore-340e9.firebasestorage.app"})
db = firestore.client()


# Define the request body model for the /test endpoint
class RequestBody(BaseModel):
    file_name: str
    acc_id: str
    test_type: bool
    lan_flag: str


# Define the root endpoint
@app.get("/")
async def root():
    """Root endpoint that returns a welcome message and checks environment variables."""
    return {
        "message": "Backend with the Deep Learning model of the SayMore app----"
        + check_env_variables()
    }


# Define the /test endpoint
@app.post("/test")
async def test(request_body: RequestBody):
    """Endpoint to handle audio file analysis requests.

    Args:
        request_body (RequestBody): The request body containing file_name, acc_id, test_type, and lan_flag.

    Returns:
        dict: The result of the audio analysis.

    Raises:
        HTTPException: If an error occurs during processing.

    """
    try:
        file_name = request_body.file_name
        acc_id = request_body.acc_id
        test_type = request_body.test_type
        test_tag = datetime.now().strftime("%Y%m%d%H%M%S")
        lan_flag = request_body.lan_flag

        # Create necessary directories
        os.makedirs("recordings", exist_ok=True)
        os.makedirs("recordings/PS_Check", exist_ok=True)
        os.makedirs("recordings/Stuttering_Check", exist_ok=True)

        # Download the audio file from Firebase storage
        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        blob.download_to_filename(file_name)

        # Analyze the audio file
        analysis_result = analysing_audio(file_name, test_type, lan_flag)

        # Update Firestore with the analysis result
        doc_ref = db.collection("User_Accounts").document(acc_id)
        if test_type:
            doc_ref.update(
                {
                    f"results.PS_Check.{test_tag}": json.loads(
                        json.dumps(analysis_result)
                    )
                }
            )
        else:
            doc_ref.update(
                {
                    f"results.Stuttering_Check.{test_tag}": json.loads(
                        json.dumps(analysis_result)
                    )
                }
            )

        # Clean up the downloaded file
        blob.delete()
        os.remove(file_name)
        if "error" in analysis_result:
            raise HTTPException(status_code=500, detail=analysis_result["error"])
        return {"result": analysis_result}
    except RuntimeError as e:
        logging.error("An error occurred: %s", str(e))
        raise HTTPException(
            status_code=500, detail="An internal error has occurred."
        ) from e
    except Exception as e:
        logging.error("An unexpected error occurred: %s", str(e))
        raise HTTPException(
            status_code=500, detail="An unexpected error has occurred."
        ) from e


# Function to check if necessary environment variables are set
def check_env_variables():
    """Check if the required environment variables are set.

    Returns:
        str: A message indicating the status of the environment variables.

    """
    google_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
    azure_speech_key = os.getenv("AZURE_SPEECH_KEY")
    azure_speech_region = os.getenv("AZURE_SPEECH_REGION")
    google_api_key = os.getenv("GOOGLE_API_KEY")

    unset_vars = []

    if google_credentials is None:
        unset_vars.append("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    if firebase_credentials is None:
        unset_vars.append("FIREBASE_CREDENTIALS")
    if azure_speech_key is None:
        unset_vars.append("AZURE_SPEECH_KEY")
    if azure_speech_region is None:
        unset_vars.append("AZURE_SPEECH_REGION")
    if google_api_key is None:
        unset_vars.append("GOOGLE_API_KEY")

    if not unset_vars:
        return "All the variables (GOOGLE_APPLICATION_CREDENTIALS_JSON, FIREBASE_CREDENTIALS, AZURE_SPEECH_KEY, AZURE_SPEECH_REGION, GOOGLE_API_KEY) are set"
    else:
        return f"The following environment variables are not set: {', '.join(unset_vars)}"
