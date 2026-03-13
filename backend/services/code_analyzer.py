from typing import List, Dict, Any


def analyze_logic(language: str, code: str) -> List[Dict[str, Any]]:
    """
    Very minimal placeholder for logical bug detection.
    In a real system this might use static analysis and custom rules.
    """
    findings: List[Dict[str, Any]] = []

    if "==" in code and "None" in code and language.lower() == "python":
        findings.append(
            {
                "type": "logical_bug",
                "message": "Use 'is None' instead of '== None' in Python.",
                "severity": "warning",
            }
        )

    return findings

