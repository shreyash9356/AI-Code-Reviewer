import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import CodeEditor from './CodeEditor';
import AnalysisPanel from './AnalysisPanel';
import Settings from './Settings';
import { Play, UploadCloud } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('review');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(`def example_function(data):
    # This loop has no break condition
    while True:
        print("Processing data")
        
    password = "hardcoded_secret_123"
    
    # Inefficient loop example
    for i in range(len(data)):
        for j in range(len(data)):
            val = data[i] + data[j]
            
    return 0
`);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
      
      // Auto-detect language from extension
      const extension = file.name.split('.').pop().toLowerCase();
      const extMap = {
        'py': 'python',
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'cc': 'cpp',
        'h': 'cpp',
        'cs': 'c#',
        'rb': 'ruby',
        'go': 'go',
        'php': 'php',
        'swift': 'swift',
        'rs': 'rust',
        'html': 'html',
        'css': 'css',
        'sql': 'sql',
        'sh': 'bash',
      };
      
      if (extMap[extension]) {
         setLanguage(extMap[extension]);
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the exact same file can be uploaded again if needed
    event.target.value = '';
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setResults(null);
    
    try {
      const storedApiKey = localStorage.getItem('gemini_api_key');
      const response = await fetch('http://127.0.0.1:8000/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          code, 
          language,
          ...(storedApiKey && { api_key: storedApiKey })
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Make sure the backend server is running on http://127.0.0.1:8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col p-6 gap-6">
        <header className="flex justify-between items-center bg-panel px-6 py-4 rounded-xl border border-gray-800 shadow-sm">
           <div className="flex gap-4 items-center">
             <select 
               value={language}
               onChange={(e) => setLanguage(e.target.value)}
               className="bg-background border border-gray-700 text-sm rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent font-medium"
             >
               <option value="python">Python</option>
               <option value="javascript">JavaScript</option>
               <option value="java">Java</option>
               <option value="cpp">C++</option>
             </select>
             
             <button 
               onClick={() => fileInputRef.current.click()}
               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
             >
               <UploadCloud size={16} />
               Upload File
             </button>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileUpload} 
               className="hidden" 
               accept=".py,.js,.jsx,.ts,.tsx,.java,.c,.cpp,.h,.cs,.rb,.go,.php,.swift,.rs,.html,.css,.sql,.sh"
             />
           </div>
           
           <button 
             onClick={handleAnalyze}
             disabled={loading}
             className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-blue-600 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
           >
             <Play size={16} fill="currentColor" />
             {loading ? 'Analyzing...' : 'Analyze Code'}
           </button>
        </header>

        {activeTab === 'settings' ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto w-full custom-scrollbar">
            <Settings />
          </div>
        ) : (
          <div className="flex-1 flex gap-6 min-h-0">
             {/* Left Editor */}
             <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between px-4 py-2 bg-panel border border-b-0 border-gray-800 rounded-t-xl">
                   <span className="text-xs font-mono text-gray-400">main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : 'java'}</span>
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-error"></div>
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                   </div>
                </div>
                <div className="flex-1 border border-gray-800 rounded-b-xl overflow-hidden relative shadow-lg">
                   <CodeEditor 
                     code={code} 
                     setCode={setCode} 
                     language={language}
                     issues={results?.issues}
                   />
                </div>
             </div>
             
             {/* Right Panel */}
             <div className="w-[450px] flex-shrink-0 bg-panel border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col min-h-0">
               <AnalysisPanel results={results} loading={loading} />
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
