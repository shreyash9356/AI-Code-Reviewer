from typing import List, Dict, Any


def analyze_security(language: str, code: str) -> List[Dict[str, Any]]:
    """
    Minimal placeholder for security checks.
    """
    findings: List[Dict[str, Any]] = []

    insecure_patterns = ["eval(", "exec("]
    if any(p in code for p in insecure_patterns):
        findings.append(
            {
                "type": "security",
                "message": "Use of eval/exec detected. This can lead to code execution vulnerabilities.",
                "severity": "high",
            }
        )

    return findings

