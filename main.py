from firebase_admin import credentials, initialize_app, storage, firestore
from fastapi import FastAPI, UploadFile, File, HTTPException
from google.cloud.firestore_v1 import ArrayUnion
from Backend.model import analyze_audio
from pydantic import BaseModel
import os

# import uuid

app = FastAPI()

cred = credentials.Certificate("saymore-340e9-firebase-adminsdk-aaxo4-2e6ac8d48e.json")
initialize_app(cred, {"storageBucket": "saymore-340e9.firebasestorage.app"})
db = firestore.client()


class RequestBody(BaseModel):
    file_name: str
    acc_id: str


@app.get("/")
async def root():
    return {"message": "Backend with the Deep Learning model of the SayMore app"}


@app.post("/test")
async def test(request_body: RequestBody):
    try:
        # ##################################################################################
        # # upload the file straight from the frontend and have it send the file_name
        # file_id = str(uuid.uuid4())
        # file_name = f"test/{acc_id}+{file_id}.wav"
        #
        # bucket = storage.bucket()
        # blob = bucket.blob(file_name)
        # blob.upload_from_file(file.file, content_type="audio/wav")
        # ####################################################################################

        file_name = request_body.file_name
        acc_id = request_body.acc_id

        os.makedirs('Temp', exist_ok=True)
        local_file = "Temp/temp_audio.wav"

        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        blob.download_to_filename(local_file)

        analysis_result = analyze_audio(local_file)

        doc_ref = db.collection("User_Accounts").document(acc_id)
        doc_ref.update({"results": ArrayUnion([analysis_result])})

        # blob.delete()
        return {"result": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
