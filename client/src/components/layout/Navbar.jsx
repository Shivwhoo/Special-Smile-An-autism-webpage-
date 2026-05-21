import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsOpen(false);
  };

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
            <Link to="/" className="flex items-center gap-2 group" aria-label="Home">
              <div className="p-1 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-border-theme/30 transition-colors">
                <img src="/logo.png" alt="Special Smile Logo" className="w-10 h-10 object-contain rounded-lg" />
              </div>
              <span className="font-heading font-bold text-2xl text-text-primary tracking-tight">
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
              {user ? (
                <div className="relative group flex items-center gap-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-medium"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-full group-hover:bg-primary/10 transition-colors">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="px-5 py-2.5 text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary py-2.5">
                    Book Session
                  </Link>
                </div>
              )}
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
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 rounded-lg text-base font-medium text-text-secondary hover:text-primary hover:bg-surface-theme/50 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                      <UserIcon className="w-5 h-5" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20 flex items-center gap-2"
                    >
                      <LogOut className="w-5 h-5" /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 rounded-lg text-base font-medium text-center text-primary border border-primary/20"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 rounded-lg text-base font-medium text-center bg-primary text-text-primary"
                    >
                      Book Session
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
