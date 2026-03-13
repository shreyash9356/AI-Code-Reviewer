from parser.ast_parser import analyze_ast
from services.bug_detector import detect_bugs
from services.performance_analyzer import analyze_performance
from services.security_scanner import scan_security
from ai_engine.gemini_reviewer import analyze_code_with_ai
from scoring.code_score import calculate_score

async def aggregate_issues(code: str, language: str, api_key: str = None) -> dict:
    """
    Combines issues from all static analysis modules and the Gemini AI engine.
    Returns a unified response.
    """
    # 1. Run static analysis modules synchronously 
    ast_issues = analyze_ast(code, language)
    bug_issues = detect_bugs(code, language)
    perf_issues = analyze_performance(code, language)
    sec_issues = scan_security(code, language)
    
    # Pool all strictly static issues
    all_static_issues = ast_issues + bug_issues + perf_issues + sec_issues
    
    # 2. Call AI asynchronously for suggestions
    # We pass the static issues so the AI knows what we've already found, saving token generation
    ai_response = await analyze_code_with_ai(code, language, api_key)
    
    # The AI response contains 'bugs', 'security_issues', 'suggestions'
    # We consolidate them. For AI-generated bugs we don't have exact line numbers easily, but we can append them
    
    for bug in ai_response.get("bugs", []):
         all_static_issues.append({
             "type": "AI Detected Bug",
             "line": "N/A",
             "severity": "Medium",
             "description": bug
         })
         
    for sec in ai_response.get("security_issues", []):
         all_static_issues.append({
             "type": "AI Security Warning",
             "line": "N/A",
             "severity": "High",
             "description": sec
         })
         
    ai_suggestions = ai_response.get("suggestions", [])
    
    # 3. Calculate code health score
    score = calculate_score(all_static_issues)
    
    return {
        "code_health_score": score,
        "issues": all_static_issues,
        "ai_suggestions": ai_suggestions,
        "security_issues": ai_response.get("security_issues", [])
    }
