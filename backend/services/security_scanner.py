import re

def scan_security(code: str, language: str) -> list:
    """
    Scans source code for common security vulnerabilities.
    """
    issues = []
    lines = code.split('\n')
    
    patterns = [
        # Hardcoded Credentials
        (r'(?i)(password|secret|api_key|token|auth)\s*=\s*[\'"][^\'"]+[\'"]', 
         "Hardcoded Credential", "High", "Sensitive information (password/key) found hardcoded in source code."),
         
        # SQL Injection Risk (e.g. concatenation)
        (r'SELECT\s+.*FROM\s+.*\s*(\+|<|%s)', 
         "SQL Injection Risk", "High", "Potential SQL injection detected. Use parameterized queries instead of string formatting."),
         
        # Unsafe eval()
        (r'\beval\s*\(', 
         "Unsafe eval()", "High", "Use of eval() is unsafe and can lead to arbitrary code execution."),
         
        # Shell command injection
        (r'\b(os\.system|subprocess\.Popen|exec)\s*\(.*(request|input|param)', 
         "Shell Command Injection", "High", "Unsanitized input being passed to OS commands."),
         
        # Weak Hashing 
        (r'\b(md5|sha1)\s*\(', 
         "Weak Hashing Algorithm", "Medium", "MD5 and SHA1 are cryptographically weak. Use SHA-256 or bcrypt.")
    ]
    
    for i, line in enumerate(lines):
        line_num = i + 1
        
        for pattern_regex, issue_type, severity, description in patterns:
            if re.search(pattern_regex, line):
                issues.append({
                    "type": issue_type,
                    "line": line_num,
                    "severity": severity,
                    "description": description
                })
                
    return issues
