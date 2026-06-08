from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Horse racing API"}