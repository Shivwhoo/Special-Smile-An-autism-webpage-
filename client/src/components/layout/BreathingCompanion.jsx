import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Square, X, Compass, RefreshCw } from 'lucide-react';

const BreathingCompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('idle'); // 'idle', 'inhale', 'hold', 'exhale'
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    let timer = null;

    if (isActive) {
      // 4-7-8 breathing technique or custom balanced 4-4-4
      // Let's use 4s Inhale, 4s Hold, 4s Exhale for a simple, soothing rhythm
      setPhase('inhale');
      setSeconds(4);

      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            // Transition phase
            setPhase((prevPhase) => {
              if (prevPhase === 'inhale') {
                return 'hold';
              } else if (prevPhase === 'hold') {
                return 'exhale';
              } else {
                return 'inhale';
              }
            });
            return 4; // 4 seconds per phase
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      setPhase('idle');
      setSeconds(0);
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isActive]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const startExercise = () => {
    setIsActive(true);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('idle');
  };

  return (
    <div className="fixed bottom-24 left-6 z-40 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-76 card bg-surface-theme/90 backdrop-blur-xl border border-secondary/20 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-text-theme items-center text-center"
          >
            <div className="flex items-center justify-between w-full border-b border-secondary/10 pb-2">
              <span className="font-heading font-semibold text-lg flex items-center gap-2 text-secondary">
                <Wind className="w-5 h-5 animate-pulse" />
                Breathing Companion
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-theme text-xs font-semibold px-2 py-1 rounded bg-secondary/10"
              >
                Close
              </button>
            </div>

            {/* Breathing Bubble */}
            <div className="relative w-40 h-40 flex items-center justify-center my-2">
              {/* Outer soft shadow ring */}
              <div className="absolute inset-0 rounded-full bg-secondary/5 border border-secondary/10 animate-soft-pulse"></div>

              {/* Pulsing ring depending on phase */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  className={`absolute rounded-full flex items-center justify-center text-white font-heading font-bold shadow-lg ${
                    phase === 'inhale' 
                      ? 'bg-secondary' 
                      : phase === 'hold' 
                        ? 'bg-primary' 
                        : phase === 'exhale' 
                          ? 'bg-accent' 
                          : 'bg-text-muted/20 text-text-theme'
                  }`}
                  animate={{
                    scale: phase === 'inhale' ? [1, 1.4] : phase === 'hold' ? 1.4 : phase === 'exhale' ? [1.4, 1] : 1,
                  }}
                  transition={{
                    duration: phase === 'inhale' || phase === 'exhale' ? 4 : 0.5,
                    ease: "easeInOut",
                    repeat: phase === 'inhale' || phase === 'exhale' ? 0 : 0
                  }}
                  style={{
                    width: '100px',
                    height: '100px'
                  }}
                >
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-xs uppercase tracking-wider opacity-90">
                      {phase === 'idle' ? 'Ready' : phase}
                    </span>
                    {phase !== 'idle' && (
                      <span className="text-xl mt-1">{seconds}s</span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Animated orbital particle for visual breath timing */}
              {isActive && (
                <motion.div
                  className="absolute w-3 h-3 rounded-full bg-white shadow-md border border-secondary"
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    originX: "50%",
                    originY: "50%",
                    width: "120px",
                    height: "120px",
                    border: "1px dashed rgba(135,206,235,0.4)",
                    borderRadius: "50%"
                  }}
                />
              )}
            </div>

            <p className="text-xs text-text-muted leading-relaxed px-2">
              {phase === 'inhale' && "Slowly breathe in... feel the calm energy flow."}
              {phase === 'hold' && "Hold your breath... rest in the peaceful moment."}
              {phase === 'exhale' && "Exhale gently... let go of all worry and tension."}
              {phase === 'idle' && "Take a 1-minute pause. Let us practice a calming breath together."}
            </p>

            <div className="w-full flex gap-2 mt-2">
              {!isActive ? (
                <button
                  onClick={startExercise}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-secondary text-white text-sm font-semibold shadow-md active:scale-95 hover:brightness-105"
                >
                  <Play className="w-4 h-4" />
                  Begin Breathing
                </button>
              ) : (
                <button
                  onClick={stopExercise}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500 text-white text-sm font-semibold shadow-md active:scale-95 hover:bg-red-600"
                >
                  <Square className="w-4 h-4" />
                  Stop Exercise
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-secondary to-accent text-white flex items-center justify-center shadow-xl cursor-pointer hover:shadow-2xl z-50 border border-white/20"
        title="Open Breathing Companion"
        aria-label="Breathing Companion Widget"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Wind className="w-7 h-7" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default BreathingCompanion;
