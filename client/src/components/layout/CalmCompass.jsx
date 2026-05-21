import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Smile, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Eye, 
  Activity, 
  Plus, 
  Minus, 
  Volume,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const CalmCompass = () => {
  const {
    theme,
    setTheme,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    reduceMotion,
    setReduceMotion
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Text to Speech logic
  const speakSelectedText = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const selectedText = window.getSelection().toString().trim();
    const textToSpeak = selectedText || "Highlight any text on the screen, and I will read it aloud for you. Welcome to Special Smile Center, a calm and magical space.";

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Choose a friendly, calm voice if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(voice => 
      voice.name.includes('Google US English') || 
      voice.name.includes('Natural') || 
      voice.name.includes('Female')
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }
    
    utterance.rate = 0.95; // Slightly slower, calming speed
    utterance.pitch = 1.05; // Slightly warmer pitch

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setSpeechUtterance(utterance);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-76 card bg-surface-theme/90 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-text-theme"
          >
            <div className="flex items-center justify-between border-b border-primary/10 pb-2">
              <span className="font-heading font-semibold text-lg flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5 animate-soft-pulse" />
                Calm Compass
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-theme text-xs font-semibold px-2 py-1 rounded bg-primary/10"
              >
                Close
              </button>
            </div>

            {/* Theme Selectors */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text-muted">Accessibility Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs gap-1 transition-all ${
                    theme === 'light' 
                      ? 'border-primary bg-primary/10 font-bold' 
                      : 'border-border-color bg-surface-theme/50 hover:bg-primary/5'
                  }`}
                >
                  <Sun className="w-4 h-4 text-primary" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs gap-1 transition-all ${
                    theme === 'dark' 
                      ? 'border-secondary bg-secondary/10 font-bold' 
                      : 'border-border-color bg-surface-theme/50 hover:bg-secondary/5'
                  }`}
                >
                  <Moon className="w-4 h-4 text-secondary" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('sepia')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs gap-1 transition-all ${
                    theme === 'sepia' 
                      ? 'border-accent bg-accent/20 font-bold' 
                      : 'border-border-color bg-surface-theme/50 hover:bg-accent/5'
                  }`}
                >
                  <Smile className="w-4 h-4 text-accent" />
                  <span>Sepia</span>
                </button>
              </div>
            </div>

            {/* Font Scaling */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-muted">Text Scaling</label>
                <span className="text-xs font-mono font-bold bg-primary/10 px-2 py-0.5 rounded text-primary">
                  {Math.round(fontScale * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFontScale(fontScale - 0.1)}
                  disabled={fontScale <= 0.75}
                  className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.75"
                  max="1.75"
                  step="0.05"
                  value={fontScale}
                  onChange={(e) => setFontScale(parseFloat(e.target.value))}
                  className="flex-grow accent-primary h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => setFontScale(fontScale + 0.1)}
                  disabled={fontScale >= 1.75}
                  className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Additional Accessibility Controls */}
            <div className="grid grid-cols-2 gap-2">
              {/* High Contrast */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs justify-center transition-all ${
                  highContrast 
                    ? 'border-primary bg-primary/10 font-bold text-primary' 
                    : 'border-border-color bg-surface-theme/50 hover:bg-primary/5 text-text-theme'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>High Contrast</span>
              </button>

              {/* Reduce Motion */}
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs justify-center transition-all ${
                  reduceMotion 
                    ? 'border-secondary bg-secondary/10 font-bold text-secondary' 
                    : 'border-border-color bg-surface-theme/50 hover:bg-secondary/5 text-text-theme'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Calm Motion</span>
              </button>
            </div>

            {/* Voice Reader / TTS */}
            <div className="flex flex-col gap-2 bg-primary/5 p-3 rounded-xl border border-primary/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-primary" />
                  Voice Reader
                </span>
                {isPlaying && (
                  <span className="flex gap-0.5">
                    <span className="w-1 h-3 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1 h-3 bg-primary rounded-full animate-bounce delay-100"></span>
                    <span className="w-1 h-3 bg-primary rounded-full animate-bounce delay-200"></span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-text-muted leading-tight">
                {isPlaying 
                  ? "Speaking selected content... Click STOP to end narration." 
                  : "Highlight any text on the page, then click below to read it aloud."}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={speakSelectedText}
                  className="flex-grow flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary text-white text-xs font-semibold shadow-md active:scale-95 hover:brightness-105"
                >
                  <Volume className="w-3.5 h-3.5" />
                  {isPlaying ? "Speak Selected" : "Narrate Text"}
                </button>
                {isPlaying && (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center justify-center p-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 active:scale-95"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-xl cursor-pointer hover:shadow-2xl z-50 border border-white/20"
        title="Open Accessibility Calm Compass"
        aria-label="Calm Compass Settings"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Smile className="w-7 h-7" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default CalmCompass;
