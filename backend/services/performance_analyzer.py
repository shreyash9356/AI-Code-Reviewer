import re

def analyze_performance(code: str, language: str) -> list:
    """
    Analyzes code for performance bottlenecks like inefficient loops or O(N^2) complexity.
    """
    issues = []
    lines = code.split('\n')
    
    loop_stack = []
    
    for i, line in enumerate(lines):
        line_num = i + 1
        stripped = line.strip()
        
        # Simple string-matching detection for loops to find nesting
        # (Works heuristically across Python, JS, C++, Java)
        is_loop = re.match(r'^(for|while)\b', stripped)
        
        # Inefficient algorithms: Repeated calculations (e.g. len() in loop condition for C++)
        if re.search(r'for\s*\([^;]+;\s*\w+\s*<\s*\w+\.length\(\)', stripped):
             issues.append({
                 "type": "Repeated Calculation",
                 "line": line_num,
                 "severity": "Low",
                 "complexity": "O(n)",
                 "description": "Calculating length in loop condition. Consider caching the length in a variable."
             })
             
        # Detect nesting based on indentation for python, or brace counting for C-like
        # Simplified Check for MVP: if 'for ' or 'while ' appears indented after another loop
        if is_loop:
            indent = len(line) - len(line.lstrip())
            
            # Pop loops that have ended (indentation is less or equal)
            while loop_stack and loop_stack[-1]['indent'] >= indent:
                loop_stack.pop()
                
            if loop_stack:
                # We are nested
                depth = len(loop_stack) + 1
                complexity = "O(n²)" if depth == 2 else f"O(n^{depth})"
                issues.append({
                    "type": "Inefficient Nested Loop",
                    "line": line_num,
                    "severity": "Medium" if depth == 2 else "High",
                    "complexity": complexity,
                    "description": f"Nested loop detected with estimated complexity {complexity}. Consider using hash maps or optimizing algorithm."
                })
            
            loop_stack.append({'line': line_num, 'indent': indent})
            
    return issues
