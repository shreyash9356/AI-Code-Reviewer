import React from 'react';
import { motion } from 'framer-motion';

const ScoreIndicator = ({ score }) => {
  const percentage = Math.max(0, Math.min(100, score));
  
  // Determine color based on score
  let color = '#ef4444'; // Red for low
  if (percentage >= 80) color = '#22c55e'; // Green for high
  else if (percentage >= 60) color = '#f59e0b'; // Yellow for medium

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex bg-background p-6 border border-gray-800 rounded-xl items-center gap-6 shadow-sm">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="z-10 text-2xl font-bold font-mono" style={{ color }}>
          {percentage}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-100">Code Health Score</h3>
        <p className="text-sm text-gray-400 mt-1">
          Based on static analysis, security scans, and algorithmic complexity.
        </p>
      </div>
    </div>
  );
};

export default ScoreIndicator;
