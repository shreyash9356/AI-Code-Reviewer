def calculate_score(issues: list) -> int:
    """
    Calculates a code health score (0-100) based on issue severities.
    Start with 100.
    High severity -> -15
    Medium severity -> -8
    Low severity -> -3
    """
    score = 100
    
    for issue in issues:
        severity = issue.get("severity", "Low")
        
        if severity == "High":
            score -= 15
        elif severity == "Medium":
            score -= 8
        elif severity == "Low":
            score -= 3
            
    # Ensure score stays within 0 to 100 bounds
    return max(0, min(100, score))
