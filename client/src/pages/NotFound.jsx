import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Smile, Compass } from 'lucide-react';

const NotFound = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 5 + 3,
        color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.45)`,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-theme px-4 sm:px-6 lg:px-8 text-text-theme relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="max-w-md w-full space-y-6 bg-surface-theme border border-secondary/20 p-10 rounded-[2.5rem] shadow-2xl text-center z-10 backdrop-blur-sm animate-gentle-float"
      >
        <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        
        <div>
          <span className="inline-flex py-1 px-3.5 rounded-full bg-secondary/20 text-text-theme text-[10px] font-bold uppercase tracking-wider mb-2 items-center gap-1 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-secondary" /> Lost?
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-text-theme tracking-tight mt-1">
            404 - Page Not Found
          </h2>
          <p className="mt-3 text-sm text-text-muted leading-relaxed">
            The page you are looking for has floated away into space. Let us guide you back to safety!
          </p>
        </div>

        <div className="pt-2">
          <Link to="/" className="btn-secondary w-full py-3 inline-block font-bold text-xs shadow-md">
            Go back home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
