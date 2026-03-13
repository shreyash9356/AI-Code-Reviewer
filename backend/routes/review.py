from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_reviewer import analyze_code
from utils.github_fetcher import fetch_github_repo_files

router = APIRouter()

class CodeReviewRequest(BaseModel):
    code: str
    language: str

class RepoReviewRequest(BaseModel):
    github_url: str

class ReviewResponse(BaseModel):
    bugs: list[str]
    security_issues: list[str]
    suggestions: list[str]
    code_quality_score: str

@router.post("/review", response_model=ReviewResponse)
async def review_code(request: CodeReviewRequest):
    """
    Endpoint to review a specific snippet of code.
    """
    try:
        if not request.code.strip():
            raise HTTPException(status_code=400, detail="Code cannot be empty.")
            
        result = await analyze_code(request.code, request.language)
        
        # Ensure it matches the requested Response model
        validated_result = ReviewResponse(**result)
        return validated_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/review-repo", response_model=ReviewResponse)
async def review_repo(request: RepoReviewRequest):
    """
    Endpoint to fetch files from a GitHub repository and review them.
    """
    try:
        # Fetch files from Github
        files_content = await fetch_github_repo_files(request.github_url)
        if not files_content:
            raise HTTPException(status_code=400, detail="Could not fetch any supported code files from the repository.")
            
        # Combine files content for analysis
        combined_code = ""
        for file_path, content in files_content.items():
            combined_code += f"\n\n--- File: {file_path} ---\n{content}"
            
        # Send to AI for review
        result = await analyze_code(combined_code, "multiple files")
        
        # Ensure it matches the requested Response model
        validated_result = ReviewResponse(**result)
        return validated_result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
