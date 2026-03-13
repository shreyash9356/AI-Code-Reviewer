from typing import List, Dict, Any


def analyze_performance(language: str, code: str) -> List[Dict[str, Any]]:
    """
    Minimal placeholder that flags obvious performance anti-patterns.
    """
    findings: List[Dict[str, Any]] = []

    if "for" in code and ".append(" in code:
        findings.append(
            {
                "type": "performance",
                "message": "Consider list comprehensions or vectorized operations for loops with many appends.",
                "severity": "info",
            }
        )

    return findings

