import React from 'react';
import ScoreIndicator from './ScoreIndicator';
import IssueCard from './IssueCard';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalysisPanel = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-accent">
        <Loader2 size={40} className="animate-spin mb-4" />
        <h3 className="font-medium text-lg text-gray-200">Analyzing Code with AI...</h3>
        <p className="text-sm text-gray-400 mt-2">Checking syntax, performance, and security rules.</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center px-8">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
           <Sparkles size={32} className="text-gray-400" />
        </div>
        <h3 className="font-medium text-lg text-gray-300 mb-2">Ready to Review</h3>
        <p className="text-sm leading-relaxed">
          Paste your code on the left and click "Analyze Code" to detect bugs, security vulnerabilities, and receive AI-generated architectural suggestions.
        </p>
      </div>
    );
  }

  const { code_health_score, issues = [], ai_suggestions = [], security_issues = [] } = results;

  return (
    <div className="h-full overflow-y-auto pr-4 space-y-8 custom-scrollbar">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ScoreIndicator score={code_health_score} />
      </motion.div>

      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
          Security Vulnerabilities
        </h3>
        {security_issues.length > 0 ? (
          <div className="space-y-3">
            {security_issues.map((sec, i) => (
              <IssueCard 
                key={`sec-${i}`} 
                issue={{ type: "Security Alert", description: sec, severity: "High", line: "N/A" }} 
                index={i} 
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-success text-sm bg-success/10 p-3 rounded-lg border border-success/20">
            <CheckCircle2 size={16} /> No critical security vulnerabilities found.
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
          Static & AI Issues
        </h3>
        {issues.length > 0 ? (
          <div className="space-y-3">
            {issues.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-success text-sm bg-success/10 p-3 rounded-lg border border-success/20">
            <CheckCircle2 size={16} /> No functional issues detected by static analysis.
          </div>
        )}
      </div>

      {ai_suggestions.length > 0 && (
        <div className="pb-8">
          <h3 className="text-sm font-bold text-[#a371f7] uppercase tracking-wider mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
            <Sparkles size={16} /> Architectural Suggestions
          </h3>
          <div className="space-y-3">
             {ai_suggestions.map((sugg, i) => (
                <div key={i} className="p-4 bg-[#a371f7]/5 border border-[#a371f7]/20 rounded-lg text-sm text-gray-300 leading-relaxed">
                  {sugg}
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
