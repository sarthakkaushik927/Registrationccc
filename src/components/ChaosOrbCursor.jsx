import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const ChaosOrbCursor = () => {
  // Increased size slightly for a bigger presence
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
      className="fixed top-0 left-0 pointer-events-none z-[10] flex items-center justify-center hidden md:flex opacity-15"
    >
      {/* 1. Outer Shell - Made subtler to blend with background */}
      {/* Very low opacity blue tint, high blur, soft large blue shadow instead of border */}
      <div className="absolute inset-0 bg-blue-500/2 backdrop-blur-[4px] rounded-full shadow-[0_0_80px_rgba(0,100,255,0.15)]"></div>
      
      {/* 2. Inner Nucleus - VERY FAST & COLORFUL */}
      <motion.div
        animate={{
            // Jitter movement
            x: [0, 25, -35, 15, -20, 0],
            y: [0, -15, 25, -30, 10, 0],
            // Violent scaling
            scale: [1, 1.8, 0.6, 1.5, 0.9, 1],
            // COLOR CYCLING (Neon Blues/Purples/Cyans)
            backgroundColor: [
              "rgba(0, 255, 255, 0.9)", // Cyan
              "rgba(0, 100, 255, 0.9)", // Deep Blue
              "rgba(180, 0, 255, 0.9)", // Purple
              "rgba(0, 255, 255, 0.9)"  // Back to Cyan
            ],
            // MATCHING GLOWING SHADOWS
            boxShadow: [
              "0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.5)", // Cyan Glow
              "0 0 30px rgba(0, 100, 255, 1), 0 0 60px rgba(0, 100, 255, 0.5)", // Blue Glow
              "0 0 30px rgba(180, 0, 255, 1), 0 0 60px rgba(180, 0, 255, 0.5)", // Purple Glow
              "0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.5)"  // Back to Cyan Glow
            ]
        }}
        transition={{
            duration: 0.6, // VERY FAST Speed (was 5s)
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
        }}
        // Base size and blur for the nucleus
        className="w-14 h-14 rounded-full blur-md "
      />
    </motion.div>
  );
};

export default ChaosOrbCursor;