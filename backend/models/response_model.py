from typing import List, Dict, Any

from pydantic import BaseModel


class AnalyzeResponse(BaseModel):
    language: str
    logical_issues: List[Dict[str, Any]]
    performance_issues: List[Dict[str, Any]]
    security_issues: List[Dict[str, Any]]
    ai_suggestions: List[str]

