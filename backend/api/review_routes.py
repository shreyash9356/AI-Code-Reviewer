from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
from services.issue_aggregator import aggregate_issues
from utils.github_fetcher import fetch_github_repo_files

router = APIRouter()

class CodeReviewRequest(BaseModel):
    code: str
    language: str

class RepoReviewRequest(BaseModel):
    github_url: str

class ReviewResponse(BaseModel):
    code_health_score: int
    issues: List[Any]
    ai_suggestions: List[str]
    security_issues: List[str]

@router.post("/review", response_model=ReviewResponse)
async def review_code(request: CodeReviewRequest):
    """
    Endpoint to review a specific snippet of code combining static analysis and AI.
    """
    try:
        if not request.code.strip():
            raise HTTPException(status_code=400, detail="Code cannot be empty.")
            
        result = await aggregate_issues(request.code, request.language)
        
        validated_result = ReviewResponse(**result)
        return validated_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/review-repo", response_model=ReviewResponse)
async def review_repo(request: RepoReviewRequest):
    """
    Endpoint to fetch files from a GitHub repository and review them uniformly.
    """
    try:
        files_content = await fetch_github_repo_files(request.github_url)
        if not files_content:
            raise HTTPException(status_code=400, detail="Could not fetch any supported code files from the repository.")
            
        combined_code = ""
        for file_path, content in files_content.items():
            combined_code += f"\n\n--- File: {file_path} ---\n{content}"
            
        result = await aggregate_issues(combined_code, "multiple files")
        
        validated_result = ReviewResponse(**result)
        return validated_result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
