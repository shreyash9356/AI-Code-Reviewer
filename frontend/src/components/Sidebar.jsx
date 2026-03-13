import React from 'react';
import { Code2, GitBranch, History, Settings, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'review', label: 'Code Review', icon: Code2 },
    { id: 'repo', label: 'GitHub Scan', icon: GitBranch },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-panel border-r border-gray-800 flex flex-col h-full flex-shrink-0">
      <div className="flex items-center gap-3 p-6 border-b border-gray-800">
        <div className="p-2 bg-accent/20 rounded-lg text-accent">
          <ShieldCheck size={28} />
        </div>
        <h1 className="font-bold text-lg tracking-tight text-white">AI Code Reviewer</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium
                ${isActive 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          MVP Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
