import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  // Swing physics
  const rawSwing = useMotionValue(0);
  const swing = useSpring(rawSwing, { stiffness: 120, damping: 8, mass: 0.6 });
  const swingRotate = useTransform(swing, [-1, 0, 1], [-12, 0, 12]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Only trigger swing if scroll delta is significant
      if (Math.abs(delta) > 3) {
        rawSwing.set(delta > 0 ? 1 : -1);
      }

      lastScrollY.current = currentY;

      // Let the spring settle back to 0
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        rawSwing.set(0);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, [rawSwing]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Mentor', path: '/mentor' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-surface-theme/90 backdrop-blur-md border-b border-border-theme/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group relative" aria-label="Home">
              {/* Hanging logo container */}
              <div className="relative hidden md:block" style={{ width: '52px', height: '20px' }}>
                {/* The vine/rope connector */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[3px] h-[14px] rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, var(--secondary-color), var(--primary-color))',
                  }}
                />
                {/* Decorative leaf on vine */}
                <div className="absolute left-1/2 top-[3px] w-[8px] h-[6px] rounded-full opacity-70"
                  style={{
                    background: 'var(--secondary-color)',
                    transform: 'translateX(2px) rotate(-30deg)',
                  }}
                />

                {/* Hanging badge - swings from the top pivot */}
                <motion.div
                  className="absolute left-1/2 top-[10px]"
                  style={{
                    rotate: swingRotate,
                    originX: '50%',
                    originY: '0%',
                    x: '-50%',
                  }}
                >
                  {/* Small knot at pivot */}
                  <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full"
                    style={{ background: 'var(--secondary-color)' }}
                  />

                  {/* The actual logo badge */}
                  <div className="mt-1 p-[3px] rounded-2xl shadow-lg border-2 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                      borderColor: 'var(--secondary-color)',
                    }}
                  >
                    <div className="bg-surface-theme rounded-xl p-1">
                      <img
                        src="/logo.png"
                        alt="Special Smile Logo"
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Tiny shadow beneath the badge */}
                  <div className="mx-auto mt-1 w-8 h-[3px] rounded-full opacity-20 blur-[2px]"
                    style={{ background: 'var(--text-primary)' }}
                  />
                </motion.div>
              </div>

              {/* Mobile: simple inline logo (no hanging) */}
              <div className="md:hidden p-1 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-border-theme/30 transition-colors">
                <img src="/logo.png" alt="Special Smile Logo" className="w-10 h-10 object-contain rounded-lg" />
              </div>

              {/* Text logo - swings with the badge on desktop */}
              <motion.span
                className="font-heading font-extrabold text-2xl md:text-3xl text-text-primary tracking-tight md:ml-4 hidden md:inline-block"
                style={{
                  rotate: swingRotate,
                  originX: '0%',
                  originY: '0%',
                }}
              >
                Special<span className="text-primary">Smile</span>
              </motion.span>
              {/* Mobile: static text */}
              <span className="font-heading font-bold text-2xl text-text-primary tracking-tight md:hidden">
                Special<span className="text-primary">Smile</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/5'
                      : 'text-text-secondary hover:text-primary hover:bg-surface-theme/50 dark:hover:bg-white/5'
                  }`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-border-theme/40 pl-6">
              <Link to="/book" className="btn-primary py-2.5">
                Book Session
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-primary hover:bg-surface-theme/50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border-theme bg-surface-theme"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary hover:text-primary hover:bg-surface-theme/50 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-6 pt-6 border-t border-border-theme flex flex-col gap-3">
                <Link
                  to="/book"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-center bg-primary text-text-primary"
                >
                  Book Session
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
