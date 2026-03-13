import ast

class CodeParserVisitor(ast.NodeVisitor):
    def __init__(self):
        self.issues = []
        self.variables = set()
        self.used_variables = set()

    def visit_While(self, node):
        # Detect infinite loops like while True:
        if isinstance(node.test, ast.Constant) and node.test.value is True:
            # Check if there is a break statement inside the loop
            has_break = any(isinstance(n, ast.Break) for n in ast.walk(node))
            if not has_break:
                self.issues.append({
                    "type": "Infinite Loop",
                    "line": getattr(node, 'lineno', 0),
                    "severity": "High",
                    "description": "While loop condition evaluates to True and possesses no break statement."
                })
        self.generic_visit(node)

    def visit_FunctionDef(self, node):
        # Detect long functions
        start_line = getattr(node, 'lineno', 0)
        end_line = getattr(node, 'end_lineno', getattr(node, 'lineno', 0))
        if (end_line - start_line) > 50:
            self.issues.append({
                "type": "Long Function",
                "line": start_line,
                "severity": "Medium",
                "description": f"Function '{node.name}' is too long ({(end_line - start_line)} lines). Consider breaking it into smaller functions."
            })
            
        # Check deep nesting (rough approximation via depth of AST subnodes)
        def get_depth(node):
            if not isinstance(node, ast.AST): return 0
            if getattr(node, '_fields', ()):
                children = [getattr(node, field) for field in node._fields]
                children = [c for c in children if isinstance(c, (ast.AST, list))]
                max_depth = 0
                for child in children:
                    if isinstance(child, list):
                        max_depth = max(max_depth, max([get_depth(c) for c in child if isinstance(c, ast.AST)] + [0]))
                    else:
                        max_depth = max(max_depth, get_depth(child))
                return 1 + max_depth
            return 1
            
        # simple heuristic for control flow nesting
        nesting = 0
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.For, ast.While, ast.Try, ast.With)):
                nesting += 1
                
        if nesting > 4: # simplified check
             self.issues.append({
                "type": "Deep Nesting",
                "line": start_line,
                "severity": "Medium",
                "description": f"Function '{node.name}' has high cyclomatic complexity/nesting."
            })
            
        self.generic_visit(node)

    def visit_Compare(self, node):
        # Detect Null comparison mistakes (e.g. x == None instead of x is None)
        for ops, comparator in zip(node.ops, node.comparators):
            if isinstance(ops, (ast.Eq, ast.NotEq)) and isinstance(comparator, ast.Constant) and comparator.value is None:
                self.issues.append({
                    "type": "Null Comparison Mistake",
                    "line": getattr(node, 'lineno', 0),
                    "severity": "Low",
                    "description": "Use 'is None' or 'is not None' instead of '==' or '!=' when comparing with None."
                })
        self.generic_visit(node)
        
    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Store):
            self.variables.add(node.id)
        elif isinstance(node.ctx, ast.Load):
            self.used_variables.add(node.id)
        self.generic_visit(node)

def analyze_ast(code: str, language: str) -> list:
    """
    Parses string code using AST and returns structured issues.
    Currently only supports Python AST parsing.
    """
    if language.lower() != "python":
        return []
        
    try:
        tree = ast.parse(code)
        visitor = CodeParserVisitor()
        visitor.visit(tree)
        
        # Check for unused variables
        unused = visitor.variables - visitor.used_variables
        if unused:
             visitor.issues.append({
                 "type": "Unused Variables",
                 "line": 0,
                 "severity": "Low",
                 "description": f"Variables assigned but never used: {', '.join(unused)}"
             })
             
        return visitor.issues
    except SyntaxError as e:
        return [{
            "type": "Syntax Error",
            "line": getattr(e, 'lineno', 0),
            "severity": "High",
            "description": f"Syntax error: {str(e)}"
        }]
    except Exception as e:
        return []
