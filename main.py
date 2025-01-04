from fastapi import FastAPI, UploadFile, File, HTTPException
from firebase_admin import credentials, initialize_app, storage, firestore
from google.cloud.firestore_v1 import ArrayUnion
import uuid
from Backend.model import analyze_audio
import os

app = FastAPI()

cred = credentials.Certificate("saymore-340e9-firebase-adminsdk-aaxo4-0c2888eda4.json")
initialize_app(cred, {"storageBucket": "saymore-340e9.firebasestorage.app"})
db = firestore.client()


@app.get("/")
async def root():
    return {"message": "Backend of the SayMore app"}


@app.post("/test/{acc_id}")
async def test(acc_id: str, file: UploadFile = File(...)):
    try:
        ##################################################################################
        # upload the file straight from the frontend and have it send the file_name
        file_id = str(uuid.uuid4())
        file_name = f"test/{acc_id}+{file_id}.wav"

        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        blob.upload_from_file(file.file, content_type="audio/wav")
        ####################################################################################

        os.makedirs('Temp', exist_ok=True)
        local_file = "Temp/temp_audio.wav"

        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        blob.download_to_filename(local_file)

        analysis_result= analyze_audio(local_file)

        doc_ref = db.collection("User_Accounts").document(acc_id)
        doc_ref.update({"results": ArrayUnion([analysis_result])})

        blob.delete()
        return {"result": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
