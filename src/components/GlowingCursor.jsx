import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const GlowingCursor = () => {
  const CURSOR_SIZE = 20;

  // --- 1. MOUSE TRACKING (INSTANT / SNAPPY) ---
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // CHANGED: High stiffness + Low mass = Instant tracking (No delay)
  const springConfig = { damping: 20, stiffness: 2000, mass: 0.1 };
  
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // --- 2. STATE FOR EFFECTS ---
  const [ripples, setRipples] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const lastSparkleTime = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - CURSOR_SIZE / 2);
      mouseY.set(e.clientY - CURSOR_SIZE / 2);

      // --- SPARKLE GENERATION ---
      const now = Date.now();
      if (now - lastSparkleTime.current > 40) {
        const newSparkle = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          offsetX: (Math.random() - 0.5) * 10, 
        };

        setSparkles((prev) => [...prev, newSparkle]);
        lastSparkleTime.current = now;

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
      
      {/* --- SPARKLES (TRAIL) --- */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0.5, x: sparkle.x, y: sparkle.y }}
            animate={{ 
              opacity: 0, 
              scale: 0, 
              x: sparkle.x + sparkle.offsetX,
              y: sparkle.y + 40 // Gravity
            }}
            transition={{ duration: 0.8, ease: "linear" }}
            className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full blur-[0.5px]"
            style={{ left: 0, top: 0 }}
          />
        ))}
      </AnimatePresence>

      {/* --- THE MAIN CURSOR (INSTANT) --- */}
      <motion.div
        style={{ translateX: smoothX, translateY: smoothY }}
        className="absolute top-0 left-0 w-5 h-5 hidden md:block"
      >
        <div 
          className="w-full h-full bg-blue-400 rounded-full border border-blue-500"
          style={{ 
            boxShadow: "0 0 10px 2px rgba(34, 211, 238, 0.8), 0 0 20px 15px rgba(59, 130, 246, 0.4)" 
          }}
        />
      </motion.div>

      {/* --- DIRECTIONAL RIPPLES --- */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: ripple.x, 
              y: ripple.y,
              borderWidth: "3px"
            }}
            animate={{ 
              opacity: 0, 
              scale: 2.5, 
              x: ripple.x + 80, 
              y: ripple.y + 80,
              borderWidth: "0px"
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 left-0 w-10 h-10 rounded-full border-cyan-400"
            style={{ 
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