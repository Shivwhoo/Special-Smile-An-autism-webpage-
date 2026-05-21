import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  HeartPulse, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  Award,
  BookOpen, 
  Smile, 
  Users,
  Compass,
  ArrowLeft
} from 'lucide-react';

// Friendly interactive canvas background for Hero section
const CalmCanvasHero = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.tx = e.clientX - rect.left;
      mouseRef.current.ty = e.clientY - rect.top;
    };

    canvas.parentNode.addEventListener('mousemove', handleMouseMove);

    // Create soothing pastel blobs
    const blobs = [
      { x: width * 0.25, y: height * 0.3, r: 160, vx: 0.2, vy: 0.3, color: 'rgba(184, 225, 255, 0.45)' }, // calm-blue
      { x: width * 0.75, y: height * 0.4, r: 200, vx: -0.3, vy: 0.25, color: 'rgba(199, 233, 192, 0.45)' }, // sage
      { x: width * 0.5, y: height * 0.7, r: 180, vx: 0.15, vy: -0.2, color: 'rgba(245, 230, 211, 0.5)' }, // warm-beige
    ];

    const draw = () => {
      // Clear canvas with soft white overlay
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Draw and animate blobs
      blobs.forEach((blob) => {
        // Move blobs slowly
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Boundary bounce
        if (blob.x - blob.r < 0 || blob.x + blob.r > width) blob.vx *= -1;
        if (blob.y - blob.r < 0 || blob.y + blob.r > height) blob.vy *= -1;

        // Mouse influence
        const dx = mouse.x - blob.x;
        const dy = mouse.y - blob.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          const force = (400 - dist) / 400 * 30;
          blob.x -= (dx / dist) * force * 0.1;
          blob.y -= (dy / dist) * force * 0.1;
        }

        // Draw soft radiant gradient
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas.parentNode) {
        canvas.parentNode.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />;
};

const Home = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: 'Expert Care',
      description: 'Personalized therapy plans designed by Dr. Lovely Priya for your child\'s unique needs.',
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-secondary" />,
      title: 'Compassionate Approach',
      description: 'A warm, safe, and nurturing environment where your child can truly thrive.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-accent" />,
      title: 'Proven Progress',
      description: 'Evidence-based methods that celebrate every milestone, big or small.',
    },
  ];

  // Milestone timelines
  const milestones = [
    {
      age: 'Infancy (0 - 12 Months)',
      title: 'Sensory Exploration & Trust',
      tip: 'Encourage tummy time and colorful tracking toys. Early sensory exploration builds brain wiring.',
      details: 'Milestones include smiling, tracking faces, cooing, and building initial core strength. Sensory stimulation is vital here.'
    },
    {
      age: 'Toddlerhood (1 - 3 Years)',
      title: 'Motor Coordination & Early Speech',
      tip: 'Practice stackable blocks and simple 2-word queries. Celebrate communication attempts.',
      details: 'Milestones include walking, vocabulary expansion, stacking objects, and mimicking actions. Social interaction increases.'
    },
    {
      age: 'Preschool (3 - 5 Years)',
      title: 'Creative Play & Self-Regulation',
      tip: 'Engage in pretend-play games and identify simple emotional faces to foster self-regulation.',
      details: 'Milestones include drawing circles, storytelling, expressing complex emotions, and participating in cooperative play.'
    },
    {
      age: 'School Age (5 - 8 Years)',
      title: 'Cognitive Agility & Social Bonding',
      tip: 'Use puzzle grids, peer game boards, and supportive positive counseling to guide learning.',
      details: 'Milestones include reading, writing, forming strong friendships, complex problem-solving, and enhanced emotional resilience.'
    }
  ];

  // Reviews
  const reviews = [
    {
      name: 'Rohan Sharma',
      relation: 'Parent of Aarav (Age 5)',
      text: 'Dr. Lovely Priya is like an angel. Aarav used to face heavy sensory breakdowns, but within months of therapy, he is now smiling and communicating his feelings so happily!',
      rating: 5,
      date: '2 weeks ago'
    },
    {
      name: 'Meera Deshmukh',
      relation: 'Parent of Diya (Age 7)',
      text: 'The occupational and speech intervention here is absolutely top-notch. The patience and love they show is out of this world. Highly recommend Special Smile!',
      rating: 5,
      date: '1 month ago'
    },
    {
      name: 'Anjali Verma',
      relation: 'Parent of Kabir (Age 4)',
      text: 'Beautiful pastel calm environment that immediately sets a child at ease. Dr. Lovely Priya understands child psychology deeply and guided us at every milestone.',
      rating: 5,
      date: '3 weeks ago'
    }
  ];

  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-bg-theme overflow-x-hidden text-text-theme">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-gradient-to-b from-primary/10 via-bg-theme to-bg-theme">
        <CalmCanvasHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6 shadow-sm border border-primary/10 animate-soft-pulse">
              <Sparkles className="w-4 h-4 text-primary" />
              Empowering Every Step
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-8 leading-tight">
              A Safe Space for Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Child to Bloom</span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
              Specialized child developmental education, occupational therapy, sensory integration, and behavioral therapies led by <strong>Dr. Lovely Priya</strong> (B.D.S., Special Educator). We believe in celebrating uniqueness and nurturing potential.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/book" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-lg shadow-xl hover:shadow-primary/20">
                Book a Consultation <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/services" className="w-full sm:w-auto btn-outline text-lg bg-surface-theme/50 backdrop-blur-sm border-2 border-primary/20 hover:border-primary text-text-theme">
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-theme/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Choose Special Smile?</h2>
            <p className="text-text-muted max-w-2xl mx-auto">We provide holistic, multidisciplinary care tailored to your child's specific developmental and learning journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="card text-center flex flex-col items-center bg-surface-theme/60 backdrop-blur-sm hover:scale-[1.03]"
              >
                <div className="p-4 bg-primary/10 rounded-2xl mb-6 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="py-24 bg-surface-theme relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                {/* Beautiful dynamic floating backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] transform translate-x-4 translate-y-4 animate-gentle-float"></div>
                <img 
                  src="/image.png" 
                  alt="Dr. Lovely Priya" 
                  className="relative z-10 w-full h-auto rounded-[2.5rem] shadow-2xl object-cover aspect-[4/5] hover:scale-98 transition-transform duration-500 border border-primary/10"
                />
                
                <div className="absolute -bottom-6 -left-6 bg-surface-theme/90 backdrop-blur-md p-5 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-primary/20">
                  <div className="p-2.5 bg-yellow-400/10 rounded-xl text-yellow-500">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-base leading-none text-text-theme">Dr. Lovely Priya</p>
                    <p className="text-xs text-text-muted mt-1">B.D.S., Special Educator</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <span className="text-xs uppercase tracking-wider text-primary font-bold">FOUNDER & CHIEF THERAPIST</span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-text-theme mt-2 mb-6">
                Meet Dr. Lovely Priya
              </h2>
              <p className="text-lg text-text-muted mb-6 leading-relaxed">
                As a leading expert in pediatric special education and child developmental therapies, Dr. Lovely Priya brings extensive clinical skill and heartfelt dedication to Special Smile Center. Combining her medical background in dental surgery (B.D.S.) with specialized credentials in special education and developmental therapies, her approach uniquely blends clinical excellence with profound empathy.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-text-muted">Specialized in early intervention, special education, and behavioral therapies.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                  <span className="text-text-muted">Certified developmental tutor focusing on speech and motor intervention.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                  <span className="text-text-muted">Dedicated to parent counseling and holistic family support.</span>
                </li>
              </ul>
              
              <Link to="/mentor" className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30">
                Read Full Profile <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developmental Milestones interactive scroller */}
      <section className="py-24 bg-surface-theme/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">Child Development</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-1 mb-4">Developmental Milestones Garden</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Click any developmental stage below to bloom parenting tips & details from Dr. Lovely Priya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedMilestone(m)}
                className="cursor-pointer card bg-surface-theme/75 border border-secondary/10 hover:border-secondary p-6 rounded-2xl flex flex-col justify-between h-64 shadow-md text-left"
              >
                <div>
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">{m.age}</span>
                  <h3 className="font-heading font-bold text-lg text-text-theme mt-4 leading-snug">{m.title}</h3>
                  <p className="text-xs text-text-muted mt-2 line-clamp-3">"{m.tip}"</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-secondary font-bold mt-4">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMilestone(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface-theme max-w-lg w-full rounded-3xl p-8 border border-secondary/20 shadow-2xl text-text-theme z-10"
            >
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">{selectedMilestone.age}</span>
              <h3 className="font-heading font-bold text-2xl mt-4 text-text-theme">{selectedMilestone.title}</h3>
              
              <div className="my-6 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                <span className="text-xs font-bold text-secondary block mb-1">💡 QUICK TIP</span>
                <p className="text-sm italic text-text-theme">"{selectedMilestone.tip}"</p>
              </div>

              <div className="mb-6">
                <span className="text-xs font-bold text-text-muted block mb-1">DEVELOPMENTAL OVERVIEW</span>
                <p className="text-sm leading-relaxed text-text-muted">{selectedMilestone.details}</p>
              </div>

              <button
                onClick={() => setSelectedMilestone(null)}
                className="w-full btn-secondary text-sm"
              >
                Go Back
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reviews/Testimonials Section */}
      <section className="py-24 bg-surface-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider text-accent font-bold">Trusted by Families</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-1 mb-4">Heartfelt Parents Testimonials</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Read honest feedback from beautiful families who blossomed under Dr. Lovely Priya's guidance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedReview(rev)}
                className="card bg-surface-theme/60 backdrop-blur-sm border border-accent/15 hover:border-accent p-6 rounded-2xl shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-text-theme italic line-clamp-4">"{rev.text}"</p>
                </div>
                <div className="flex items-center justify-between mt-6 border-t border-accent/10 pt-4">
                  <div>
                    <h4 className="font-bold text-sm text-text-theme">{rev.name}</h4>
                    <p className="text-xs text-text-muted">{rev.relation}</p>
                  </div>
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{rev.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface-theme max-w-lg w-full rounded-3xl p-8 border border-accent/20 shadow-2xl text-text-theme z-10"
            >
              <div className="flex gap-1 text-yellow-400 mb-3">
                {[...Array(selectedReview.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <h3 className="font-heading font-bold text-xl text-text-theme">{selectedReview.name}</h3>
              <p className="text-xs text-text-muted mb-6">{selectedReview.relation}</p>

              <p className="text-base text-text-theme italic leading-relaxed mb-6 bg-accent/5 p-4 rounded-2xl border border-accent/10">
                "{selectedReview.text}"
              </p>

              <button
                onClick={() => setSelectedReview(null)}
                className="w-full btn-secondary text-sm"
              >
                Close testimonial
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-accent z-0 opacity-90"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/90">
            Schedule a consultation with Dr. Lovely Priya and take the first step towards unlocking your child's potential.
          </p>
          <Link to="/book" className="px-8 py-4 bg-white text-primary hover:bg-gray-50 font-bold rounded-xl shadow-lg transition-all duration-300 inline-block text-lg hover:scale-105 active:scale-95">
            Book an Appointment Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
