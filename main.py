import json
import os
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from firebase_admin import credentials, firestore, initialize_app, storage
from pydantic import BaseModel

from src.logic import analysing_audio

# Load environment variables from a .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Get Firebase credentials from environment variable
firebase_credentials_json = os.getenv("FIREBASE_CREDENTIALS")

# Raise an error if the FIREBASE_CREDENTIALS environment variable is not set
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


# Define the request body model using Pydantic
class RequestBody(BaseModel):
    file_name: str
    acc_id: str
    test_type: bool
    lan_flag: str


# Define the root endpoint
@app.get("/")
async def root():
    """Root endpoint that returns a welcome message."""
    return {"message": "Backend with the Deep Learning model of the SayMore app"}


# Define the test endpoint
@app.post("/test")
async def test(request_body: RequestBody):
    """Test endpoint that processes an audio file and updates the Firestore database with the analysis results.

    Args:
        request_body (RequestBody): The request body containing file_name, acc_id, test_type, and lan_flag.

    Returns:
        dict: A dictionary containing the analysis result.

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

        # Download the file from Firebase Storage
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

        # Clean up by deleting the file from storage and local filesystem
        blob.delete()
        os.remove(file_name)
        return {"result": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
