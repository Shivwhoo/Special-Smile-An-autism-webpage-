import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-theme border-t border-border-theme/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group" aria-label="Home">
              <div className="p-1 bg-surface-theme dark:bg-white/10 rounded-lg shadow-sm border border-border-theme/30 transition-colors">
                <img src="/logo.png" alt="Special Smile Logo" className="w-8 h-8 object-contain rounded-md" />
              </div>
              <span className="font-heading font-bold text-xl text-text-primary tracking-tight">
                Special<span className="text-primary">Smile</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Empowering specially-abled children and their families through dedicated, compassionate, and expert developmental care.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-text-secondary hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-text-secondary hover:text-primary text-sm transition-colors">Therapies & Services</Link></li>
              <li><Link to="/mentor" className="text-text-secondary hover:text-primary text-sm transition-colors">Meet Dr. Lovely Priya</Link></li>
              <li><Link to="/contact" className="text-text-secondary hover:text-primary text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-text-secondary hover:text-primary text-sm transition-colors">FAQs</Link></li>
              <li><Link to="/resources" className="text-text-secondary hover:text-primary text-sm transition-colors">Parent Resources</Link></li>
              <li><Link to="/privacy" className="text-text-secondary hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-text-secondary hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a 
                  href="https://maps.app.goo.gl/P48Qe5iVSdP3yf8k6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors text-left"
                >
                  Adarsh Vihar Colony, Lane No. 1, T-Point,<br/>Gola Road, Patna, Bihar
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-secondary">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:06124032920" className="hover:text-primary transition-colors">
                  0612-4032920
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-secondary">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:jaylovelypriya@gmail.com" className="hover:text-primary transition-colors">
                  jaylovelypriya@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-border-theme/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Special Smile Center. All rights reserved.
          </p>
          <p className="text-text-secondary text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{' '}
            <a 
              href="https://www.linkedin.com/in/shivam-kishore-103556329/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium text-primary hover:underline hover:text-primary-dark transition-all"
            >
              Shivam Kishore
            </a>{' '}
            for the community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
