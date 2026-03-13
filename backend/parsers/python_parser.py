from ast import parse, AST
from typing import Optional


def parse_python(code: str) -> Optional[AST]:
    """
    Parse Python code into an AST. Example hook for richer static analysis.
    """
    try:
        return parse(code)
    except SyntaxError:
        return None

