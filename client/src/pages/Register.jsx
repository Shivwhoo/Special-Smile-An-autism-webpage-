import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { Sparkles, Smile, ShieldAlert } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (serviceId) {
        navigate(`/book?service=${serviceId}`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate, serviceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-theme py-20 px-4 sm:px-6 lg:px-8 text-text-theme relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-gentle-float"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-soft-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 bg-surface-theme border border-primary/20 p-10 rounded-[2.5rem] shadow-2xl z-10 backdrop-blur-md"
      >
        <div className="text-center">
          <span className="inline-flex py-1 px-3.5 rounded-full bg-secondary/20 text-text-theme text-xs font-bold uppercase tracking-wider mb-3 items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-secondary" /> Join Special Smile
          </span>
          <h2 className="text-3xl font-extrabold font-heading tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-xs text-text-muted">
            Register to schedule custom sessions and log child milestones.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl"
          >
            <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
            <span>{error || 'Failed to register, please check input fields.'}</span>
          </motion.div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Full Name */}
            <div className="relative group">
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3.5 bg-surface-theme border border-border-color focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all duration-300 font-semibold text-sm pt-6 placeholder-transparent peer"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              <label 
                htmlFor="name"
                className="absolute left-4 top-2 text-[10px] font-bold text-text-muted uppercase transition-all duration-300 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-semibold peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-primary"
              >
                Full Name
              </label>
            </div>

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
                value={formData.email}
                onChange={handleChange}
              />
              <label 
                htmlFor="email"
                className="absolute left-4 top-2 text-[10px] font-bold text-text-muted uppercase transition-all duration-300 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-semibold peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-primary"
              >
                Email Address
              </label>
            </div>

            {/* Phone Number */}
            <div className="relative group">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="w-full px-4 py-3.5 bg-surface-theme border border-border-color focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all duration-300 font-semibold text-sm pt-6 placeholder-transparent peer"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
              <label 
                htmlFor="phone"
                className="absolute left-4 top-2 text-[10px] font-bold text-text-muted uppercase transition-all duration-300 pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-semibold peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-primary"
              >
                Phone Number
              </label>
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3.5 bg-surface-theme border border-border-color focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all duration-300 font-semibold text-sm pt-6 placeholder-transparent peer"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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
                  Registering...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 border-t border-border-color pt-6">
          <p className="text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
