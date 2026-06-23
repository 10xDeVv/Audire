import os
import logging

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import APIConnectionError, AuthenticationError, RateLimitError

from app.models import AnalyzeRequest, AnalyzeResponse
from app.services.ai_service import analyze_music_idea

load_dotenv(override=True)

logger = logging.getLogger("audire")

app = FastAPI(title="Audire API")

frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in frontend_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    try:
        return await analyze_music_idea(payload)
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=401,
            detail="OpenAI rejected the API key. Check the backend API key setting.",
        ) from exc
    except RateLimitError as exc:
        raise HTTPException(
            status_code=429,
            detail="OpenAI quota is unavailable. Check API billing and project limits.",
        ) from exc
    except APIConnectionError as exc:
        raise HTTPException(
            status_code=503,
            detail="Audire could not connect securely to OpenAI. Try again shortly.",
        ) from exc
    except Exception as exc:
        logger.exception("Music analysis failed")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while analyzing your musical idea.",
        ) from exc
