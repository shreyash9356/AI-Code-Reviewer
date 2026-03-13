import re

def detect_bugs(code: str, language: str) -> list:
    """
    Detects common logical bugs across multiple languages using simple static analysis.
    """
    issues = []
    lines = code.split('\n')
    
    for i, line in enumerate(lines):
        line_num = i + 1
        stripped = line.strip()
        
        # Division by zero risk
        if re.search(r'/\s*0', stripped) or re.search(r'/\s*False', stripped):
            issues.append({
                "type": "Division by Zero",
                "line": line_num,
                "severity": "High",
                "description": "Potential explicit division by zero detected."
            })
            
        # Recursive call without base case check (simplistic regex approach for MVP)
        # Note: This is hard to do accurately with regex, relying on AST for deeper Python checks.
        
        # Unreachable code (e.g. code after return)
        # Very simple heuristic: return followed by same-indent code
        if language.lower() in ["javascript", "java", "c++", "cpp"]:
            if re.search(r'return\s+[^;]+;\s*\w+', stripped):
                issues.append({
                     "type": "Unreachable Code",
                     "line": line_num,
                     "severity": "Medium",
                     "description": "Code statements found immediately after a return in the same block."
                })
                
    return issues
