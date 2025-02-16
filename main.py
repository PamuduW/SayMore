from firebase_admin import credentials, initialize_app, storage, firestore
from fastapi import FastAPI, UploadFile, File, HTTPException
from google.cloud.firestore_v1 import ArrayUnion
from Model.model import analyze_audio
from pydantic import BaseModel
import os

app = FastAPI()

cred = credentials.Certificate("saymore-340e9-firebase-adminsdk-aaxo4-2e6ac8d48e.json")
initialize_app(cred, {"storageBucket": "saymore-340e9.firebasestorage.app"})
db = firestore.client()


class RequestBody(BaseModel):
    file_name: str
    acc_id: str
    test_type: bool


@app.get("/")
async def root():
    return {"message": "Backend with the Deep Learning model of the SayMore app"}


@app.post("/test")
async def test(request_body: RequestBody):
    try:
        file_name = request_body.file_name
        acc_id = request_body.acc_id
        test_type = request_body.test_type

        os.makedirs("recordings", exist_ok=True)
        os.makedirs("recordings/PS_Check", exist_ok=True)
        os.makedirs("recordings/Stuttering_Check", exist_ok=True)

        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        blob.download_to_filename(file_name)

        analysis_result = analyze_audio(file_name, test_type)

        doc_ref = db.collection("User_Accounts").document(acc_id)
        if test_type:
            doc_ref.update({"results": {"PS_Check": ArrayUnion([analysis_result])}})
        else:
            doc_ref.update({"results": {"Stuttering_Check": ArrayUnion([analysis_result])}})

        blob.delete()
        os.remove(file_name)
        return {"result": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
