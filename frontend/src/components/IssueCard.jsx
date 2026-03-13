import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const IssueCard = ({ issue, index }) => {
  const { type, line, severity, description, complexity } = issue;
  
  let Icon = Info;
  let bgClass = 'bg-accent/10 border-accent/30';
  let badgeClass = 'bg-accent/20 text-accent';
  
  if (severity === 'High') {
    Icon = ShieldAlert;
    bgClass = 'bg-error/10 border-error/30';
    badgeClass = 'bg-error/20 text-error';
  } else if (severity === 'Medium') {
    Icon = AlertTriangle;
    bgClass = 'bg-warning/10 border-warning/30';
    badgeClass = 'bg-warning/20 text-warning';
  }

  const isAI = type.includes("AI");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border flex gap-4 ${bgClass}`}
    >
      <div className={`mt-1 flex-shrink-0 ${badgeClass.split(' ')[1]}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-100 flex items-center gap-2">
            {type}
            {isAI && <span className="text-[10px] px-2 py-0.5 bg-[#a371f7]/20 text-[#a371f7] rounded-full uppercase tracking-wider font-bold">✨ AI Suggested</span>}
          </h4>
          <span className={`text-xs px-2 py-1 rounded-md font-medium ${badgeClass}`}>
            {severity}
          </span>
        </div>
        
        <p className="text-sm text-gray-300 leading-relaxed">
          {description}
        </p>
        
        <div className="flex gap-4 mt-3 text-xs font-mono text-gray-400">
          {line && line !== "N/A" && line !== 0 && (
             <span className="bg-background px-2 py-1 rounded border border-gray-800">
               Line {line}
             </span>
          )}
          {complexity && (
             <span className="bg-background px-2 py-1 rounded border border-gray-800">
               Complexity: {complexity}
             </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;
