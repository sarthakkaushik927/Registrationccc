import React from 'react';
import { motion } from 'framer-motion';

export const NetworkBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#000000]">
      {/* Dim Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Abstract Lines matching the screenshot aesthetic */}
      <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M10,10 L30,40 L60,20 L80,50 L50,80 L20,60 Z"
          stroke="#00f2ff"
          strokeWidth="0.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M90,10 L70,30 L40,10 L20,90"
          stroke="#0055ff"
          strokeWidth="0.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 0.5 }}
        />
        {/* Nodes */}
        <circle cx="30" cy="40" r="1" fill="#003366" stroke="#00f2ff" strokeWidth="0.2" />
        <circle cx="60" cy="20" r="1.5" fill="#003366" stroke="#00f2ff" strokeWidth="0.2" />
        <circle cx="50" cy="80" r="2" fill="#003366" stroke="#00f2ff" strokeWidth="0.2" />
      </svg>
      
      {/* Bottom Grid Effect */}
      <div className="absolute bottom-0 w-full h-24 bg-[linear-gradient(to_top,rgba(0,100,255,0.2)_1px,transparent_1px),linear-gradient(to_right,rgba(0,100,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(50px)] opacity-50"></div>
    </div>
  );
};