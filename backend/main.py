from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.review import router as review_router
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="AI Code Review API",
    description="Backend for AI-powered Code Review web application using Google Gemini API.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to point to your specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(review_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Code Review API. Use POST /api/review or POST /api/review-repo to analyze code."}
