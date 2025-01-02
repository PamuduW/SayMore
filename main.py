from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Backend of the SayMore app"}

@app.get("/test/{test_type}")
async def say_hello(test_type: int):
    return {"message": f"Hello {test_type}"}