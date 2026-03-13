from typing import List

# In a real implementation you would import the LLM SDK (Gemini, OpenAI, etc.)
# and call it here. This is a lightweight async stub that you can extend.


async def generate_ai_suggestions(language: str, code: str) -> List[str]:
    """
    Call an LLM to generate high-level review comments.
    For hackathon starter, we just return a static suggestion.
    """
    # TODO: integrate with Gemini or another LLM provider using settings.GEMINI_API_KEY
    return [
        f"AI suggestion stub: Consider adding more unit tests for this {language} code.",
        "In production, this would include detailed style, readability, and robustness feedback.",
    ]

