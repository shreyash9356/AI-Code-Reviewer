import os
import json
import google.generativeai as genai
from fastapi import HTTPException

def configure_gemini(user_api_key: str = None):
    api_key = user_api_key or os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here" or api_key == "your_actual_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured and no user key was provided. Please add your actual API key to the .env file or Settings page.")
    genai.configure(api_key=api_key)

async def analyze_code_with_ai(code: str, language: str, api_key: str = None) -> dict:
    """
    Analyzes code using Google Gemini AI and returns a structured JSON response.
    """
    try:
        configure_gemini(api_key)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    MAX_CODE_LENGTH = 50000
    if len(code) > MAX_CODE_LENGTH:
        raise HTTPException(status_code=400, detail=f"Code snippet is too large. Maximum length is {MAX_CODE_LENGTH} characters.")

    valid_languages = {"python", "javascript", "typescript", "java", "cpp", "c", "c++", "c#", "ruby", "go", "php", "swift", "kotlin", "rust", "html", "css", "sql", "bash", "shell", "multiple files"}
    if language.lower() not in valid_languages and language != "multiple files":
         raise HTTPException(status_code=400, detail=f"Unsupported programming language '{language}'. Please provide a valid language.")

    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an expert software engineer and security reviewer. Review the following {language} code.
    Identify any bugs, security vulnerabilities, and provide code improvements and best practice suggestions.
    
    Return the response strictly in the exact following JSON structure without any additional markdown formatting. It must be valid parseable JSON:
    {{
        "bugs": ["bug 1", "bug 2"],
        "security_issues": ["issue 1", "issue 2"],
        "suggestions": ["suggestion 1", "suggestion 2"]
    }}
    
    If there are none in a category, return an empty array [].
    
    Code to review:
    {code}
    """

    try:
        response = await model.generate_content_async(prompt)
        response_text = response.text.strip()
        
        if response_text.startswith("```json"): response_text = response_text[7:]
        if response_text.startswith("```"): response_text = response_text[3:]
        if response_text.endswith("```"): response_text = response_text[:-3]
            
        parsed_result = json.loads(response_text.strip())
        
        required_keys = ["bugs", "security_issues", "suggestions"]
        for key in required_keys:
            if key not in parsed_result:
                parsed_result[key] = []
                
        return parsed_result
        
    except json.JSONDecodeError as jde:
        raise HTTPException(status_code=502, detail=f"Failed to parse AI response into valid JSON. Error: {str(jde)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")
