import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper for the specific neon blue border style from the screenshot
const inputClasses = `
  w-full px-4 py-2.5 
  bg-[#050505] 
  border border-[#00aaff]/60 
  rounded-md 
  text-white text-sm font-medium tracking-wide
  placeholder-gray-400 
  focus:outline-none focus:border-[#00aaff] focus:shadow-[0_0_15px_rgba(0,170,255,0.4)]
  transition-all duration-300
`;

export const FormInput = ({ name, type, register, error, placeholder }) => (
  <div className="mb-2 relative z-0">
    <div className="relative group">
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name)}
        className={`${inputClasses} ${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
    </div>
    <div className="min-h-[14px]">
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-[10px] mt-0.5 ml-1"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export const FormSelect = ({ name, register, error, options, placeholder }) => (
  <div className="mb-2 relative z-0">
    <div className="relative">
      <select
        id={name}
        {...register(name)}
        className={`${inputClasses} appearance-none ${!register(name).value ? 'text-gray-400' : 'text-white'}`}
      >
        <option value="" className="bg-black text-gray-400">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0b011f] text-white">
            {option}
          </option>
        ))}
      </select>
      {/* Custom Chevron matches screenshot white/blue vibe */}
      <div className="absolute right-3 top-3 pointer-events-none text-white">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
    <div className="min-h-[14px]">
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-[10px] mt-0.5 ml-1"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
);