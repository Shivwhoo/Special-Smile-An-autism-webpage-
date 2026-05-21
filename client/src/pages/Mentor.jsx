import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Award, 
  BookOpen, 
  Heart, 
  CheckCircle, 
  ArrowRight, 
  GraduationCap, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Check, 
  Activity,
  Smile
} from 'lucide-react';

// Dynamic Counter Hook for premium scrolling numbers animation
const AnimatedCounter = ({ value, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMiliseconds = duration;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasStarted, value, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
};

const Mentor = () => {
  const certifications = [
    'B.D.S. (Bachelor of Dental Surgery)',
    'Certified Special Educator',
    'Advanced Professional Training in Sensory Integration & Developmental Therapies',
    'Specialist in Early Childhood Intervention & Behavioral Strategies'
  ];

  const approaches = [
    {
      title: 'Individualized Sensory Integration',
      desc: 'No two sensory systems are identical. I analyze spatial awareness, balance, and sensory triggers to curate structured, pleasant sensory environments where kids gain sensory control and self-soothing tools.'
    },
    {
      title: 'Evidence-Based Positive Behavior Support',
      desc: 'Instead of restrictive parameters, we utilize reward loops and fun social play sessions to gently replace challenging triggers with cheerful functional reactions.'
    },
    {
      title: 'Empathetic Family Counseling',
      desc: 'Children thrive when parents are empowered. We provide ongoing, positive parent training, enabling you to practice therapeutic techniques calmly at home.'
    }
  ];

  const [activeApproach, setActiveApproach] = useState(0);

  // Operational Progress Tracker
  const [clinicStatus, setClinicStatus] = useState({
    isOpen: false,
    text: "Closed",
    progress: 0,
    timeString: ""
  });

  useEffect(() => {
    const updateClinicStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 6 is Saturday
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentMinutes = hour * 60 + minute;

      let isOpen = false;
      let startMinutes = 9 * 60; // 9:00 AM
      let endMinutes = 17 * 60; // 5:00 PM
      let progress = 0;
      let text = "Closed";

      if (day >= 1 && day <= 5) {
        // Mon - Fri: 9:00 AM - 5:00 PM
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          isOpen = true;
          text = "Open Now";
          progress = ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;
        }
      } else if (day === 6) {
        // Sat: 10:00 AM - 2:00 PM
        startMinutes = 10 * 60;
        endMinutes = 14 * 60;
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          isOpen = true;
          text = "Open Now";
          progress = ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;
        }
      }

      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setClinicStatus({
        isOpen,
        text,
        progress: Math.min(Math.max(progress, 0), 100),
        timeString: formattedTime
      });
    };

    updateClinicStatus();
    const interval = setInterval(updateClinicStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-bg-theme text-text-theme overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden bg-gradient-to-b from-primary/10 via-bg-theme to-bg-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2rem] transform translate-x-4 translate-y-4 animate-gentle-float"></div>
                <img 
                  src="/image.png" 
                  alt="Dr. Lovely Priya" 
                  className="relative z-10 w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl border border-primary/10 hover:scale-[1.01] transition-all duration-300"
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <span className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1.5 mb-4">
                <Heart className="w-4 h-4 text-primary animate-pulse" />
                Lead Consultant & Founder
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 leading-tight">
                Dr. Lovely Priya
              </h1>
              <p className="text-lg font-bold text-secondary mb-6 bg-secondary/10 px-3 py-1 rounded-full inline-block">
                B.D.S., Special Educator
              </p>
              
              <div className="relative my-8 p-6 rounded-2xl bg-surface-theme/60 border border-primary/20 backdrop-blur-sm shadow-sm italic text-text-muted leading-relaxed">
                <span className="text-4xl font-serif text-primary/30 absolute top-2 left-2">“</span>
                <p className="pl-6 text-base">
                  Every child has a unique light. My mission at Special Smile is to help them shine by providing a nurturing environment where they feel understood, supported, and empowered to grow.
                </p>
              </div>

              {/* Scrolling Stats Observer Counter */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-surface-theme/80 border border-primary/10 shadow-sm text-center">
                  <div className="text-2xl font-bold font-heading text-primary">
                    <AnimatedCounter value="15" suffix="+" />
                  </div>
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Years Experience</div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-theme/80 border border-secondary/10 shadow-sm text-center">
                  <div className="text-2xl font-bold font-heading text-secondary">
                    <AnimatedCounter value="10" suffix="+" />
                  </div>
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Specializations</div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-theme/80 border border-accent/15 shadow-sm text-center">
                  <div className="text-2xl font-bold font-heading text-accent">
                    <AnimatedCounter value="100" suffix="%" />
                  </div>
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Parent Love</div>
                </div>
              </div>

              <Link to="/book" className="btn-primary inline-flex items-center gap-2 text-lg shadow-xl hover:shadow-primary/20">
                Book a Consultation <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 bg-surface-theme/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left: My Approach & Education */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Animated Accordion Approach */}
              <div>
                <h2 className="text-3xl font-bold font-heading mb-6 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-secondary" /> My Therapeutic Approach
                </h2>
                <div className="flex flex-col gap-4">
                  {approaches.map((app, idx) => (
                    <div 
                      key={idx}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        activeApproach === idx 
                          ? 'border-secondary bg-surface-theme shadow-md' 
                          : 'border-border-color bg-surface-theme/40 hover:bg-surface-theme/60'
                      }`}
                    >
                      <button
                        onClick={() => setActiveApproach(activeApproach === idx ? null : idx)}
                        className="w-full flex justify-between items-center p-5 text-left font-bold font-heading text-text-theme cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            activeApproach === idx ? 'bg-secondary text-white' : 'bg-primary/20 text-primary'
                          }`}>{idx + 1}</span>
                          {app.title}
                        </span>
                        {activeApproach === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      <AnimatePresence>
                        {activeApproach === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="p-5 pt-0 text-sm leading-relaxed text-text-muted border-t border-border-color/30">
                              {app.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certs */}
              <div>
                <h2 className="text-3xl font-bold font-heading mb-6 flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-primary" /> Education & Certifications
                </h2>
                <div className="bg-surface-theme/80 border border-primary/20 rounded-3xl p-8 shadow-sm backdrop-blur-sm">
                  <ul className="space-y-4">
                    {certifications.map((cert, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="p-1 bg-primary/10 rounded-full text-primary shrink-0 mt-0.5">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-base text-text-theme font-medium leading-tight">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Sticky: Availability & Real-Time Operational Hours */}
            <div className="lg:col-span-1">
              <div className="bg-surface-theme border border-primary/10 rounded-3xl p-8 shadow-xl sticky top-28 backdrop-blur-md">
                
                {/* Real-time Status Tracker */}
                <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      Clinic Status
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      clinicStatus.isOpen 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${clinicStatus.isOpen ? 'bg-green-500 animate-ping' : 'bg-red-500'}`}></span>
                      {clinicStatus.text}
                    </span>
                  </div>
                  
                  {clinicStatus.isOpen && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-primary/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${clinicStatus.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-text-muted mt-1 leading-none">
                        Active operational day progress ({clinicStatus.timeString})
                      </p>
                    </div>
                  )}
                  
                  {!clinicStatus.isOpen && (
                    <p className="text-[10px] text-text-muted mt-1">
                      Our doors open daily at 9:00 AM.
                    </p>
                  )}
                </div>

                <h3 className="text-xl font-bold font-heading text-text-theme mb-3">Availability</h3>
                <p className="text-sm text-text-muted mb-6 leading-relaxed">
                  Dr. Lovely Priya is available for both in-person sessions at our center and secure virtual teletherapy consults.
                </p>
                
                <ul className="space-y-4 mb-8 text-sm">
                  <li className="flex justify-between border-b border-border-color pb-2">
                    <span className="text-text-muted font-medium">Mon - Fri:</span>
                    <span className="font-semibold text-text-theme">9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-border-color pb-2">
                    <span className="text-text-muted font-medium">Saturday:</span>
                    <span className="font-semibold text-text-theme">10:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span className="text-text-muted font-medium">Sunday:</span>
                    <span className="font-bold text-red-500">Closed</span>
                  </li>
                </ul>
                
                <Link to="/book" className="btn-primary w-full flex justify-center shadow-lg hover:shadow-primary/20 hover:scale-103">
                  Schedule Now
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Mentor;
