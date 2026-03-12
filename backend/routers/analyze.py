from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from services.parser import parse_file
from services.ai_engine import generate_summary
from services.mailer import send_email

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

ALLOWED_EXTENSIONS = (".csv", ".xlsx", ".xls")
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post(
    "/analyze",
    summary="Upload a sales file and receive an AI-generated summary by email",
    tags=["Analysis"],
    responses={
        200: {"description": "Summary sent successfully"},
        400: {"description": "Invalid file type"},
        413: {"description": "File too large"},
        422: {"description": "Validation error"},
        500: {"description": "Internal server error"},
    },
)
@limiter.limit("5/minute")
async def analyze(
    request: Request,
    file: UploadFile = File(..., description="Sales file in .csv or .xlsx format"),
    email: str = Form(..., description="Recipient email address for the summary"),
):
    # Validate file type
    if not file.filename.endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only .csv or .xlsx files are accepted.",
        )

    # Validate email
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=422, detail="Invalid email address format.")

    # Read and validate file size
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, detail="File too large. Maximum allowed size is 5MB."
        )

    try:
        data_str = parse_file(file_bytes, file.filename)
        summary = generate_summary(data_str)
        send_email(email, summary)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

    return {
        "message": f"✅ AI summary successfully generated and sent to {email}",
        "status": "success",
    }