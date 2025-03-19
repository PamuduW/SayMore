import json
import os
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from firebase_admin import credentials, firestore, initialize_app, storage
from pydantic import BaseModel

from src.logic import analysing_audio

load_dotenv()

app = FastAPI()

firebase_credentials_json = os.getenv("FIREBASE_CREDENTIALS")

if firebase_credentials_json is None:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is not set")

firebase_credentials = json.loads(firebase_credentials_json)

private_key = firebase_credentials.get("private_key")
if private_key:
    firebase_credentials["private_key"] = private_key.replace("\\n", "\n")
else:
    raise ValueError("Private key not found in Firebase credentials")

cred = credentials.Certificate(firebase_credentials)
initialize_app(cred, {"storageBucket": "saymore-340e9.firebasestorage.app"})
db = firestore.client()


class RequestBody(BaseModel):
    file_name: str
    acc_id: str
    test_type: bool
    lan_flag: str


@app.get("/")
async def root():
    return {"message": "Backend with the Deep Learning model of the SayMore app"}


@app.post("/test")
async def test(request_body: RequestBody):
    try:
        file_name = request_body.file_name
        acc_id = request_body.acc_id
        test_type = request_body.test_type
        test_tag = datetime.now().strftime("%Y%m%d%H%M%S")
        lan_flag = request_body.lan_flag

        os.makedirs("recordings", exist_ok=True)
        os.makedirs("recordings/PS_Check", exist_ok=True)
        os.makedirs("recordings/Stuttering_Check", exist_ok=True)

        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        blob.download_to_filename(file_name)

        analysis_result = analysing_audio(file_name, test_type, lan_flag)

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

        blob.delete()
        os.remove(file_name)
        return {"result": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e