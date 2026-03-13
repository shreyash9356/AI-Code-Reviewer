import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode, language, issues }) => {
  const monacoRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = editor;
  };

  // Add decorations (squiggly lines) when issues update
  useEffect(() => {
    if (monacoRef.current && issues) {
      const editor = monacoRef.current;
      const monaco = window.monaco; // Accessible after mount
      
      if (!monaco) return;

      const decorations = issues
        .filter(i => i.line && i.line !== "N/A" && typeof i.line === 'number')
        .map(issue => {
          let colorClass = 'bg-primary/20'; // Suggestion
          if (issue.severity === 'High') colorClass = 'bg-error/30 inline-block border-b-2 border-error';
          else if (issue.severity === 'Medium') colorClass = 'bg-warning/30 inline-block border-b-2 border-warning';

          return {
            range: new monaco.Range(issue.line, 1, issue.line, 100),
            options: {
              isWholeLine: true,
              className: colorClass,
              glyphMarginClassName: `fas fa-exclamation-circle text-${issue.severity === 'High' ? 'error' : 'warning'}`,
              hoverMessage: { value: `**${issue.type}**: ${issue.description}` }
            }
          };
        });

      // We persist the decorations collection so we can clear it later if needed.
      // In Monaco 0.38+, editor.createDecorationsCollection() is used, but for simplicity we can use deltaDecorations
      editor.deltaDecorations([], decorations);
    }
  }, [issues, language]);

  return (
    <div className="h-full w-full rounded-md overflow-hidden border border-gray-800 bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={language.toLowerCase()}
        theme="vs-dark"
        value={code}
        onChange={(val) => setCode(val)}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          renderLineHighlight: "all",
        }}
      />
    </div>
  );
};

export default CodeEditor;
