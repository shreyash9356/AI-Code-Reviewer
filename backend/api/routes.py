from fastapi import APIRouter

from backend.models.request_model import AnalyzeRequest
from backend.models.response_model import AnalyzeResponse
from backend.services.code_analyzer import analyze_logic
from backend.services.performance import analyze_performance
from backend.services.security import analyze_security
from backend.services.ai_reviewer import generate_ai_suggestions


router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_code(payload: AnalyzeRequest) -> AnalyzeResponse:
    """Main endpoint that orchestrates static checks and AI review."""
    logic_issues = analyze_logic(payload.language, payload.code)
    performance_issues = analyze_performance(payload.language, payload.code)
    security_issues = analyze_security(payload.language, payload.code)
    ai_suggestions = await generate_ai_suggestions(payload.language, payload.code)

    return AnalyzeResponse(
        language=payload.language,
        logical_issues=logic_issues,
        performance_issues=performance_issues,
        security_issues=security_issues,
        ai_suggestions=ai_suggestions,
    )

