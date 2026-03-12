import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
from routers import analyze

load_dotenv()

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Sales Insight Automator API",
    description="""
## Sales Insight Automator
Upload a `.csv` or `.xlsx` sales file and receive a professional AI-generated
executive summary directly in your inbox.

### Features
- 📁 Supports CSV and Excel files (max 5MB)
- 🤖 AI-powered narrative summary via Groq (Llama 3)
- 📧 Instant email delivery via Resend
- 🔒 Rate limited and secured endpoints
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGIN", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Routes
app.include_router(analyze.router)


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "service": "Sales Insight Automator API"}