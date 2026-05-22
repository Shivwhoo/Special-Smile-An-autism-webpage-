import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Brain, HeartPulse, Sparkles, MessageSquare, Palette, Smile, Users, Activity, GraduationCap, Info } from 'lucide-react';
import api from '../api/axios';


const mockServices = [
  {
    _id: '1',
    title: 'Special Education',
    description: 'Tailored teaching programs designed for children with unique learning requirements to build foundational academic and cognitive skills.',
    durationMinutes: 45,
    category: 'Academic & Focus',
    icon: <GraduationCap className="w-6 h-6 text-primary" />
  },
  {
    _id: '2',
    title: 'Occupational Therapy',
    description: 'Focused on developing fine motor skills, sensory processing, and daily life skills to help children achieve ultimate independence.',
    durationMinutes: 45,
    category: 'Therapy',
    icon: <Activity className="w-6 h-6 text-secondary" />
  },
  {
    _id: '3',
    title: 'Sensory Integration',
    description: 'Specialized activities that help children process and respond effectively to sensory stimuli (touch, sound, movement) in a structured sensory room.',
    durationMinutes: 45,
    category: 'Therapy',
    icon: <Sparkles className="w-6 h-6 text-accent" />
  },
  {
    _id: '4',
    title: 'Speech & Language Therapy',
    description: 'Enhances verbal and non-verbal communication, speech clarity, vocabulary development, and social conversation skills.',
    durationMinutes: 45,
    category: 'Therapy',
    icon: <MessageSquare className="w-6 h-6 text-primary" />
  },
  {
    _id: '5',
    title: 'Art Therapy',
    description: 'Creative and expressive therapy using drawing, painting, and crafting to help children communicate feelings and build confidence.',
    durationMinutes: 45,
    category: 'Therapy',
    icon: <Palette className="w-6 h-6 text-secondary" />
  },
  {
    _id: '6',
    title: 'Behaviour Therapy',
    description: 'Positive reinforcement and targeted behavioral interventions to replace challenging behaviors with functional, positive social skills.',
    durationMinutes: 45,
    category: 'Therapy',
    icon: <HeartPulse className="w-6 h-6 text-accent" />
  },
  {
    _id: '7',
    title: 'Social Play Therapy',
    description: 'Interactive sessions designed to teach children sharing, turn-taking, cooperation, and how to make meaningful peer connections.',
    durationMinutes: 45,
    category: 'Play Groups',
    icon: <Smile className="w-6 h-6 text-primary" />
  },
  {
    _id: '8',
    title: 'Cognitive Behaviour Therapy',
    description: 'Helps older children understand the connection between thoughts, feelings, and actions, providing coping strategies for anxiety and stress.',
    durationMinutes: 50,
    category: 'Therapy',
    icon: <Brain className="w-6 h-6 text-secondary" />
  },
  {
    _id: '9',
    title: 'Group Play Therapy',
    description: 'Structured small-group settings where children learn peer interaction, communication, and collaborative team play.',
    durationMinutes: 60,
    category: 'Play Groups',
    icon: <Users className="w-6 h-6 text-accent" />
  }
];

const Services = () => {
  const [services, setServices] = useState(mockServices);
  const [selectedCategory, setSelectedCategory] = useState('All');


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        if (data && data.length > 0) {
          // Map backend categories or fallback nicely
          const mapped = data.map((item, index) => {
            const mockMatch = mockServices.find(m => m.title.toLowerCase() === item.title.toLowerCase());
            return {
              ...item,
              category: mockMatch ? mockMatch.category : (item.category === 'Other' ? 'Academic & Focus' : 'Therapy'),
              icon: mockMatch ? mockMatch.icon : <Brain className="w-6 h-6 text-primary" />
            };
          });
          setServices(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch services', error);
      }
    };
    fetchServices();
  }, []);

  const categories = ['All', 'Therapy', 'Academic & Focus', 'Play Groups'];

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-bg-theme text-text-theme overflow-x-hidden">
      {/* Header */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-secondary/10 via-bg-theme to-bg-theme relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 25 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4 border border-secondary/15 animate-soft-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Our Specializations
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
              Therapies & Services
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              We offer comprehensive, individualized care designed to empower your child. Each session is carefully crafted by Dr. Lovely Priya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Category Filter Chips */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm ${
                selectedCategory === cat 
                  ? 'bg-secondary text-white shadow-md scale-105' 
                  : 'bg-surface-theme hover:bg-secondary/10 border border-secondary/10 text-text-theme'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid with Framer Motion AnimatePresence */}
      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  key={service._id}
                  className="card bg-surface-theme/80 backdrop-blur-sm border border-secondary/10 hover:border-secondary/45 rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2.5 transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-4 bg-secondary/10 rounded-2xl group-hover:bg-secondary/20 transition-all duration-300 shadow-inner">
                      {service.icon || <Brain className="w-8 h-8 text-secondary" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                        {service.category}
                      </span>
                      <h3 className="text-xl font-bold font-heading text-text-theme mt-2 leading-snug">{service.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-text-muted text-sm leading-relaxed flex-grow mb-8">
                    {service.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-6 border-t border-border-color">
                    <div className="flex items-center gap-2 group/time relative cursor-pointer">
                      <Clock className="w-5 h-5 text-secondary" />
                      <span className="text-sm font-semibold text-text-theme hover:underline">{service.durationMinutes} mins (tentative)</span>
                      
                      {/* Quiet/tentative duration helper tooltip */}
                      <div className="absolute bottom-full mb-2 left-0 w-48 p-2.5 bg-surface-theme border border-secondary/20 text-[10px] text-text-muted rounded-xl shadow-lg opacity-0 pointer-events-none group-hover/time:opacity-100 transition-opacity duration-300 z-20 leading-tight">
                        🌿 Time slots are tentative and can be flexible depending on child focus and needs.
                      </div>
                    </div>
                    
                    <Link 
                      to={`/book?service=${service._id}`} 
                      className="w-full sm:w-auto btn-secondary text-sm inline-flex items-center justify-center gap-2 shadow-md group-hover:scale-105 transition-all duration-300"
                    >
                      Book Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
