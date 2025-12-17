import React from 'react';
import { motion } from 'framer-motion';

export const SplashScreen = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ delay: 3, duration: 1 }}
      onAnimationComplete={onComplete}
    >
      {/* Logo Recreation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 relative">
            {/* Abstract CCC Logo representation */}
           <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="8">
             <circle cx="35" cy="35" r="25" className="opacity-90" />
             <circle cx="65" cy="35" r="25" className="opacity-90" />
             <circle cx="50" cy="65" r="25" className="opacity-90" />
           </svg>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-2xl font-serif tracking-widest font-bold mb-2 text-center"
      >
        CLOUD COMPUTING CELL
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="text-blue-400 tracking-[0.5em] text-sm font-bold uppercase"
      >
        Presents
      </motion.p>
    </motion.div>
  );
};