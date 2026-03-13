from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    language: str = Field(..., description="Programming language of the source code, e.g., python, javascript, java.")
    code: str = Field(..., description="Raw source code to analyze.")

