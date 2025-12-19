import React, { useEffect, useRef } from 'react';

const MagicCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Track mouse position
    const mouse = { x: -100, y: -100 };
    
    // Configuration for the trail and sparkles
    const colors = ["#00FFFF", "#9D00FF", "#FF0080", "#00FF00", "#FFA500"];
    let particles = [];
    let animationFrameId;

    // --- CLASSES ---

    // 1. The Rainbow Dot (Trail)
    class Dot {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2; // Size between 2 and 5
        this.life = 1; // Alpha opacity (1 to 0)
        this.decay = 0.04; // How fast it fades
      }

      update() {
        this.life -= this.decay;
        this.size -= 0.1; // Shrink over time
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // 2. The Star Sparkle
    class Sparkle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 8 + 4; // Size between 4 and 12
        this.life = 1;
        this.decay = 0.02;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.2 - 0.1; // Random spin speed
        this.vx = (Math.random() - 0.5) * 2; // Random X velocity
        this.vy = (Math.random() - 0.5) * 2; // Random Y velocity
      }

      update() {
        this.life -= this.decay;
        this.angle += this.spin;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        
        // Draw 4-pointed Star
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(0, -this.size);
          ctx.rotate(Math.PI / 4); // Rotate 45 degrees
          ctx.lineTo(0, -this.size * 0.3); // Inner point
          ctx.rotate(Math.PI / 4);
        }
        ctx.fill();
        ctx.restore();
      }
    }

    // --- ANIMATION LOOP ---
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Add new particles if mouse is moving
      // We add them here to ensure they spawn even if mouse stops momentarily but loop continues
      // (Logic moved to event listener for stricter control, but cleanup happens here)

      // Update and Draw all particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);

        // Remove dead particles
        if (particles[i].life <= 0 || particles[i].size <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // --- EVENT LISTENERS ---

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // 1. Spawn Rainbow Dots (Trail)
      // Cycle colors based on particle count
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Dot(mouse.x, mouse.y, color));

      // 2. Spawn Sparkles (Randomly, not every frame)
      if (Math.random() < 0.1) { // 10% chance per move event
        particles.push(new Sparkle(mouse.x, mouse.y, "#FFFFFF")); // White sparkles look best
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Start loop
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:block" // High Z-index to sit on top
    />
  );
};

export default MagicCursor;