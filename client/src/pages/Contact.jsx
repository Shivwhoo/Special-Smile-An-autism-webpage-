import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Mic, MicOff, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import api from '../api/axios';

const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Setup Web Speech API recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        toast.info("🎙️ Listening to your voice... Speak clearly.");
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (e) => {
        setIsListening(false);
        toast.error("Could not recognize speech. Please try speaking closer to your microphone.");
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({
          ...prev,
          message: prev.message ? `${prev.message} ${transcript}` : transcript
        }));
        toast.success("Voice translated successfully!");
      };

      setRecognition(rec);
    }
  }, []);

  const toggleSpeechInput = () => {
    if (!recognition) {
      toast.warning("Speech Recognition is not supported by your current browser. Try Chrome or Edge!");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSend = {
        ...formData
      };
      await api.post('/contact', dataToSend);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ ...formData, subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: 'Phone Contact',
      details: '0612-4032920',
      description: 'Mon-Sat from 9:00 AM to 6:00 PM.',
      link: 'tel:06124032920'
    },
    {
      icon: <Mail className="w-6 h-6 text-secondary" />,
      title: 'Email Address',
      details: 'jaylovelypriya@gmail.com',
      description: 'Send us your questions anytime.',
      link: 'mailto:jaylovelypriya@gmail.com'
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: 'Clinic Location',
      details: 'Adarsh Vihar Colony, Gola Road, Patna',
      description: 'Open in Google Maps directly',
      link: 'https://maps.app.goo.gl/uhNhDqbFWW8KvFhX6'
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-bg-theme text-text-theme overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-text-theme border border-primary/10 mb-4 animate-soft-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Always Supporting Families
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-6"
          >
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base text-text-muted leading-relaxed"
          >
            Whether you have a question about our specializations, need assistance, or just want to talk, we are here for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * index }}
                className="card bg-surface-theme border border-primary/10 hover:border-primary/30 p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold font-heading mb-2">{info.title}</h3>
                <p className="text-xs text-text-muted mb-2 leading-tight">{info.description}</p>
                {info.link ? (
                  <a 
                    href={info.link} 
                    target={info.title.includes('Location') ? '_blank' : undefined} 
                    rel={info.title.includes('Location') ? 'noopener noreferrer' : undefined}
                    className="font-bold text-sm text-secondary hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {info.details}
                    {info.title.includes('Location') && <ExternalLink className="w-3.5 h-3.5" />}
                  </a>
                ) : (
                  <p className="font-bold text-sm text-secondary">{info.details}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Contact Form with Speech Translation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-surface-theme border border-secondary/15 p-8 md:p-10 rounded-3xl shadow-xl backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-text-theme mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field rounded-xl border border-border-color bg-surface-theme text-text-theme"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text-theme mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field rounded-xl border border-border-color bg-surface-theme text-text-theme"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-text-theme mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field rounded-xl border border-border-color bg-surface-theme text-text-theme"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-text-theme">
                    Message
                  </label>
                  <button
                    type="button"
                    onClick={toggleSpeechInput}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                    title="Speak into microphone to type"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" /> Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" /> Voice Dictation
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="input-field resize-none rounded-xl border border-border-color bg-surface-theme text-text-theme leading-relaxed"
                  placeholder="Tell us more about your child's needs or your questions..."
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 py-3.5 px-8 text-sm font-bold shadow-lg hover:shadow-primary/20 cursor-pointer"
              >
                {isSubmitting ? 'Sending Inquiries...' : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Embedded Google Maps Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
              Find Us on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Map</span>
            </h2>
            <p className="text-sm text-text-muted mt-2">Visit our clinic at Adarsh Vihar Colony, Gola Road, Patna</p>
          </div>
          <div className="bg-surface-theme border border-primary/10 rounded-3xl shadow-xl overflow-hidden p-2 md:p-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57555.35885575073!2d84.97905161648636!3d25.631157269794215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed57ee9d8a4747%3A0xe335d5073a9232dd!2sSpecial%20Smile!5e0!3m2!1sen!2sin!4v1779382242291!5m2!1sen!2sin"
              className="w-full rounded-2xl"
              style={{ border: 0, height: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Special Smile Center - Google Maps Location"
            ></iframe>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;
