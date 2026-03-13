import React, { useState } from 'react';
import { Save, Key } from 'lucide-react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app we'd save this to local storage or backend
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-panel border gap-6 border-gray-800 rounded-xl p-8 shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Key size={16} /> 
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API Key..."
            className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
          <p className="text-xs text-gray-500">
            Your key is stored locally in your browser and used only for analysis requests.
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-800">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-blue-600 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95"
          >
            <Save size={18} />
            {saved ? 'Saved Successfully!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
