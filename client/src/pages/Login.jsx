import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { Sparkles, Smile, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const serviceId = searchParams.get('service');

  useEffect(() => {
    if (user) {
      if (redirect === 'book' && serviceId) {
        navigate(`/book?service=${serviceId}`);
      } else if (redirect) {
        navigate(`/${redirect}`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate, redirect, serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-theme py-20 px-4 sm:px-6 lg:px-8 text-text-theme relative overflow-hidden">
      {/* Background soft design nodes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-gentle-float"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-soft-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 bg-surface-theme border border-primary/20 p-10 rounded-[2.5rem] shadow-2xl z-10 backdrop-blur-md"
      >
        <div className="text-center">
          <span className="inline-flex py-1 px-3.5 rounded-full bg-primary/20 text-text-theme text-xs font-bold uppercase tracking-wider mb-3 items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-primary" /> Welcome Back
          </span>
          <h2 className="text-3xl font-extrabold font-heading tracking-tight">
            Parent Login
          </h2>
          <p className="mt-2 text-xs text-text-muted">
            Log in to manage appointments & growth pathways.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl"
          >
            <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
            <span>{error || 'Invalid credentials, please try again.'}</span>
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email Address */}
            <div className="relative group">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3.5 bg-surface-theme border border-border-color focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all duration-300 font-semibold text-sm pt-6 placeholder-transparent peer"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label 
                htmlFor="email"
                className="absolute left-4 top-2 text-[10px] font-bold text-text-muted uppercase transition-all duration-300 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-semibold peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-primary"
              >
                Email Address
              </label>
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3.5 bg-surface-theme border border-border-color focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all duration-300 font-semibold text-sm pt-6 placeholder-transparent peer"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label 
                htmlFor="password"
                className="absolute left-4 top-2 text-[10px] font-bold text-text-muted uppercase transition-all duration-300 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-semibold peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-primary"
              >
                Password
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg hover:shadow-primary/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                'Verify & Proceed'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 border-t border-border-color pt-6">
          <p className="text-xs text-text-muted">
            New to Special Smile Center?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create Parent Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
