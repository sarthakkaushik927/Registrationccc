import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const GlowingCursor = () => {
  const CURSOR_SIZE = 20;

  // --- 1. MOUSE TRACKING ---
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // --- 2. STATE FOR EFFECTS ---
  const [ripples, setRipples] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  
  // Ref to throttle sparkle creation so it doesn't lag
  const lastSparkleTime = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Update Cursor Position
      mouseX.set(e.clientX - CURSOR_SIZE / 2);
      mouseY.set(e.clientY - CURSOR_SIZE / 2);

      // Create Sparkles (Throttled: only every 50ms or so)
      const now = Date.now();
      if (now - lastSparkleTime.current > 30) {
        const newSparkle = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          // Random slight offset for natural trail feel
          offsetX: (Math.random() - 0.5) * 10,
          offsetY: (Math.random() - 0.5) * 10,
        };

        setSparkles((prev) => [...prev, newSparkle]);
        lastSparkleTime.current = now;

        // Cleanup sparkle after 800ms
        setTimeout(() => {
          setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
        }, 800);
      }
    };

    const handleClick = (e) => {
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      
      {/* --- SPARKLES TRAIL --- */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0.8, x: sparkle.x, y: sparkle.y }}
            animate={{ 
              opacity: 0, 
              scale: 0, 
              x: sparkle.x + sparkle.offsetX, 
              y: sparkle.y + sparkle.offsetY + 20 // drift down slightly
            }}
            transition={{ duration: 0.5 }}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full blur-[1px]"
            style={{ 
                left: 0, 
                top: 0 
            }}
          />
        ))}
      </AnimatePresence>

      {/* --- THE GLOWING BALL (INTENSIFIED) --- */}
      <motion.div
        style={{ translateX: smoothX, translateY: smoothY }}
        className="absolute top-0 left-0 w-5 h-5 bg-cyan-50 rounded-full hidden md:block"
      >
        {/* Hard Glow Layer (The "Core") */}
        <div 
            className="absolute inset-0 rounded-full bg-cyan-400"
            style={{ 
                boxShadow: "0 0 15px 2px rgba(6, 182, 212, 0.8), 0 0 30px 5px rgba(59, 130, 246, 0.5)" 
            }}
        ></div>
        
        {/* Outer Halo */}
        <div className="absolute inset-[-10px] rounded-full bg-blue-500 opacity-20 blur-md"></div>
      </motion.div>

      {/* --- DIRECTIONAL RIPPLES --- */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ 
              opacity: 0.8, 
              scale: 0,
              x: ripple.x, 
              y: ripple.y,
              borderWidth: "4px"
            }}
            animate={{ 
              opacity: 0, 
              scale: 3, // Expands
              // KEY CHANGE: Move x and y positive to drift Lower-Right
              x: ripple.x + 100, 
              y: ripple.y + 100,
              borderWidth: "0px"
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 left-0 w-8 h-8 rounded-full border-cyan-400"
            style={{ 
                // We offset by -50% in CSS to center the start point on the mouse
                transformOrigin: "center center", 
                translate: "-50% -50%"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GlowingCursor;