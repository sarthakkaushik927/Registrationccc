import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const ChaosOrbCursor = () => {
  // Keeping your size preference
  const CURSOR_SIZE = 180;
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  
  // Smooth spring physics for the main floating container
  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX - CURSOR_SIZE / 2);
      mouseY.set(clientY - CURSOR_SIZE / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, CURSOR_SIZE]);

  return (
    <motion.div
      style={{ translateX: smoothX, translateY: smoothY, width: CURSOR_SIZE, height: CURSOR_SIZE }}
      className="fixed top-0 left-0 pointer-events-none z-[10] flex items-center justify-center hidden md:flex"
    >
      {/* 1. Outer Shell */}
      <div className="absolute inset-0 bg-blue-500/2 backdrop-blur-[4px] rounded-full shadow-[0_0_80px_rgba(0,100,255,0.15)]"></div>
      
      {/* 2. Inner Nucleus */}
      <motion.div
        animate={{
            // Jitter movement (Kept Fast)
            x: [0, 25, -35, 15, -20, 0],
            y: [0, -15, 25, -30, 10, 0],
            // Scale (Kept Fast to match jitter)
            scale: [1, 1.2, 0.8, 1.1, 0.9, 1],
            
            // COLOR CYCLING (Slowed Down)
            backgroundColor: [
              "rgba(0, 255, 255, 0.9)", // Cyan
              "rgba(0, 100, 255, 0.9)", // Deep Blue
              "rgba(180, 0, 255, 0.9)", // Purple
              "rgba(255, 0, 150, 0.9)", // Neon Pink
              "rgba(255, 50, 50, 0.9)", // Neon Red
              "rgba(255, 255, 0, 0.9)", // Neon Yellow
              "rgba(0, 255, 100, 0.9)", // Neon Green
              "rgba(0, 255, 255, 0.9)"  // Back to Cyan
            ],
            
            // MATCHING GLOWING SHADOWS
            boxShadow: [
              "0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.5)", // Cyan Glow
              "0 0 30px rgba(0, 100, 255, 1), 0 0 60px rgba(0, 100, 255, 0.5)", // Blue Glow
              "0 0 30px rgba(180, 0, 255, 1), 0 0 60px rgba(180, 0, 255, 0.5)", // Purple Glow
              "0 0 30px rgba(255, 0, 150, 1), 0 0 60px rgba(255, 0, 150, 0.5)", // Pink Glow
              "0 0 30px rgba(255, 50, 50, 1), 0 0 60px rgba(255, 50, 50, 0.5)", // Red Glow
              "0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.5)", // Yellow Glow
              "0 0 30px rgba(0, 255, 100, 1), 0 0 60px rgba(0, 255, 100, 0.5)", // Green Glow
              "0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.5)"  // Back to Cyan Glow
            ]
        }}
        transition={{
            // Default transition for movement/scale (Fast Chaos)
            default: {
                duration: 0.6, 
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
            },
            // Specific transition for Color/Shadow (Slow & Smooth)
            backgroundColor: {
                duration: 100, // 4 seconds cycle
                repeat: Infinity,
                repeatType: "mirror",
                ease: "linear"
            },
            boxShadow: {
                duration: 4, // 4 seconds cycle
                repeat: Infinity,
                repeatType: "mirror",
                ease: "linear"
            }
        }}
        className="w-14 h-14 rounded-full blur-md opacity-55"
      />
    </motion.div>
  );
};

export default ChaosOrbCursor;