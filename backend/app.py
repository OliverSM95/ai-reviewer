# imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from src.call_ai import stream_ai

#setup FastAPI app with CORS middleware to allow requests from the frontend
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# setup input package class
class ReviewRequest(BaseModel):
    reviews: list[str]

# main endpoint to receive reviews and return AI summary
@app.post("/review")
def review(request: ReviewRequest):
    if not request.reviews:
        return {"error": "No reviews found on this page"}
    return StreamingResponse(stream_ai(request.reviews), media_type="text/plain")

# simple health check endpoint to verify the backend is running
@app.get("/health")
def health():
    return {"status": "ok"}

# run the app with uvicorn when executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)