import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  FileText, 
  MapPin, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const BookAppointment = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get('service');

  // Services list & Selection State
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || '');
  const [selectedService, setSelectedService] = useState(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Slots State
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form State
  const [childName, setChildName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Decorative Slot tags to show therapeutic vibes
  const ALL_SLOTS = [
    { time: '09:00 AM', vibe: '🌿 Quiet slot' },
    { time: '10:00 AM', vibe: '🌿 Quiet slot' },
    { time: '11:00 AM', vibe: '✨ Popular slot' },
    { time: '12:00 PM', vibe: '🌿 Quiet slot' },
    { time: '02:00 PM', vibe: '🌿 Quiet slot' },
    { time: '03:00 PM', vibe: '✨ Popular slot' },
    { time: '04:00 PM', vibe: '🌿 Quiet slot' },
    { time: '05:00 PM', vibe: '🌿 Quiet slot' }
  ];

  // Fetch all active services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data);
        
        // If initialServiceId is provided, set that service as active
        if (initialServiceId) {
          const serviceObj = data.find(s => s._id === initialServiceId);
          if (serviceObj) {
            setSelectedService(serviceObj);
            setSelectedServiceId(initialServiceId);
          }
        } else if (data.length > 0) {
          // Preselect first service if none in URL
          setSelectedService(data[0]);
          setSelectedServiceId(data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load services. Please refresh.');
      }
    };
    fetchServices();
  }, [initialServiceId]);

  // Handle service change
  const handleServiceChange = (e) => {
    const id = e.target.value;
    setSelectedServiceId(id);
    const serviceObj = services.find(s => s._id === id);
    setSelectedService(serviceObj);
  };

  // Fetch booked slots when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      try {
        // Format date as YYYY-MM-DD
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        const { data } = await api.get(`/appointments/booked-slots?date=${formattedDate}`);
        setBookedSlots(data);
        
        // Clear timeslot selection if it is now booked
        if (data.includes(selectedTimeSlot)) {
          setSelectedTimeSlot('');
        }
      } catch (err) {
        toast.error('Failed to check available time slots.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  // Generate calendar days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    const today = new Date();
    if (newDate.getFullYear() < today.getFullYear() || 
       (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() < today.getMonth())) {
      return;
    }
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dateToCheck = new Date(year, month, day);
    return dateToCheck < today;
  };

  const formatDateDisplay = (dateObj) => {
    if (!dateObj) return '';
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) {
      toast.error('Please select a service.');
      return;
    }
    if (!selectedDate) {
      toast.error('Please select an appointment date from the calendar.');
      return;
    }
    if (!selectedTimeSlot) {
      toast.error('Please select a preferred time slot.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/appointments', {
        serviceId: selectedServiceId,
        childName,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes
      });

      toast.success('🎉 Appointment booked and confirmed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete booking.');
    } finally {
      setLoading(false);
    }
  };

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isPrevMonthDisabled = () => {
    const today = new Date();
    return year === today.getFullYear() && month === today.getMonth();
  };

  return (
    <div className="py-24 bg-bg-theme min-h-screen text-text-theme">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-text-theme border border-primary/10 mb-4 animate-soft-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Easy Scheduling
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold font-heading text-text-theme tracking-tight"
          >
            Book an Appointment
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base text-text-muted max-w-xl mx-auto"
          >
            Select your therapy and schedule a direct consultation with Dr. Lovely Priya.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Booking Form & Calendar */}
          <div className="lg:col-span-2 space-y-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="card bg-surface-theme border border-secondary/15 rounded-3xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Service Selection */}
                <div>
                  <label className="block text-sm font-semibold text-text-theme mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" /> Select Therapy / Service
                  </label>
                  <select
                    className="input-field py-3.5 text-base font-semibold bg-surface-theme text-text-theme border border-border-color cursor-pointer outline-none rounded-xl"
                    value={selectedServiceId}
                    onChange={handleServiceChange}
                    required
                  >
                    {services.map((srv) => (
                      <option key={srv._id} value={srv._id} className="bg-surface-theme text-text-theme">
                        {srv.title} ({srv.durationMinutes} mins - tentative)
                      </option>
                    ))}
                  </select>
                  
                  {selectedService && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="mt-3 bg-secondary/5 p-4 rounded-2xl border border-secondary/10"
                    >
                      <p className="text-xs text-text-muted leading-relaxed">
                        {selectedService.description}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* 2. Child Name */}
                <div>
                  <label className="block text-sm font-semibold text-text-theme mb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" /> Child's Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field py-3.5 rounded-xl border border-border-color bg-surface-theme text-text-theme"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter your child's full name"
                  />
                </div>

                {/* 3. Interactive Calendar with clean primary pastel colors */}
                <div>
                  <label className="block text-sm font-semibold text-text-theme mb-3 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-primary" /> Choose Date
                  </label>
                  
                  <div className="border border-secondary/15 rounded-3xl p-5 bg-surface-theme/50 shadow-inner">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-6 px-1">
                      <h3 className="font-heading font-bold text-lg text-text-theme">
                        {MONTH_NAMES[month]} {year}
                      </h3>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          disabled={isPrevMonthDisabled()}
                          className="p-2 rounded-xl border border-border-color hover:bg-primary/10 text-text-theme disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-2 rounded-xl border border-border-color hover:bg-primary/10 text-text-theme transition-all cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {weekdayNames.map((name) => (
                        <div key={name} className="text-xs font-bold text-text-muted py-1">
                          {name}
                        </div>
                      ))}
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const isPast = isPastDate(dayNum);
                        const isSelected = selectedDate && 
                          selectedDate.getDate() === dayNum && 
                          selectedDate.getMonth() === month && 
                          selectedDate.getFullYear() === year;
                        const isCurrentDay = isToday(dayNum);

                        return (
                          <button
                            key={`day-${dayNum}`}
                            type="button"
                            disabled={isPast}
                            onClick={() => setSelectedDate(new Date(year, month, dayNum))}
                            className={`
                              aspect-square rounded-2xl text-sm font-bold flex flex-col items-center justify-center relative transition-all duration-200 active:scale-90 cursor-pointer
                              ${isPast 
                                ? 'text-text-muted/30 cursor-not-allowed bg-transparent' 
                                : 'text-text-theme hover:bg-primary/20 hover:text-text-theme'
                              }
                              ${isSelected ? '!bg-primary !text-white shadow-lg shadow-primary/20 scale-105' : ''}
                              ${isCurrentDay && !isSelected ? 'border-2 border-primary' : ''}
                            `}
                          >
                            <span>{dayNum}</span>
                            {isCurrentDay && (
                              <span className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Time Slot Grid with skeletons and vibe checks */}
                <AnimatePresence mode="wait">
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm font-semibold text-text-theme flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" /> Select Preferred Time Slot
                      </label>

                      {loadingSlots ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="py-4 px-4 rounded-xl border border-secondary/10 bg-secondary/5 animate-pulse flex flex-col items-center gap-2">
                              <div className="w-16 h-4 bg-secondary/20 rounded"></div>
                              <div className="w-12 h-2.5 bg-secondary/15 rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {ALL_SLOTS.map((slotObj) => {
                            const isBooked = bookedSlots.includes(slotObj.time);
                            const isSelected = selectedTimeSlot === slotObj.time;

                            return (
                              <button
                                key={slotObj.time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setSelectedTimeSlot(slotObj.time)}
                                className={`
                                  py-3 px-4 rounded-2xl text-sm font-bold border text-center transition-all duration-300 active:scale-95 flex flex-col items-center justify-center gap-0.5 relative overflow-hidden cursor-pointer
                                  ${isBooked 
                                    ? 'bg-red-500/10 border-red-500/10 text-text-muted/40 cursor-not-allowed line-through' 
                                    : 'border-border-color hover:border-primary hover:bg-primary/5 text-text-theme bg-surface-theme/50'
                                  }
                                  ${isSelected ? '!border-primary !bg-primary/10 text-text-theme shadow-md scale-[1.02]' : ''}
                                `}
                              >
                                <span>{slotObj.time}</span>
                                <span className={`text-[9px] font-bold mt-0.5 tracking-tight px-1.5 py-0.2 rounded-full ${
                                  isBooked
                                    ? 'bg-red-500/20 text-red-500'
                                    : slotObj.vibe.includes('Quiet')
                                      ? 'bg-green-500/10 text-green-500'
                                      : 'bg-primary/20 text-primary'
                                }`}>
                                  {isBooked ? 'Booked' : slotObj.vibe}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 5. Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-text-theme mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" /> Additional Concerns or Notes (Optional)
                  </label>
                  <textarea
                    className="input-field min-h-[100px] py-3 rounded-xl border border-border-color bg-surface-theme text-text-theme"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any specific concerns, child's history, or queries for Dr. Lovely Priya"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-base font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-primary/20 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Securing Your Slot...
                    </>
                  ) : (
                    'Confirm & Schedule Appointment'
                  )}
                </button>

              </form>
            </motion.div>
          </div>

          {/* Sidebar Summary & Details (Right Column) */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="card bg-surface-theme border border-secondary/15 rounded-3xl overflow-hidden relative p-6 shadow-xl"
            >
              <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent absolute top-0 left-0 right-0" />
              
              <h2 className="font-heading font-bold text-xl text-text-theme mb-5 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" /> Appointment Summary
              </h2>

              <div className="space-y-4 text-sm">
                
                {/* Therapy detail */}
                <div className="pb-4 border-b border-border-color">
                  <p className="text-text-muted font-bold text-xs uppercase tracking-wider mb-1">Selected Therapy</p>
                  <p className="font-bold text-text-theme text-base leading-snug">
                    {selectedService ? selectedService.title : 'None Selected'}
                  </p>
                  {selectedService && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-theme mt-2 bg-secondary/10 border border-secondary/10 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-secondary" /> {selectedService.durationMinutes} Minutes (tentative)
                    </span>
                  )}
                </div>

                {/* Consultant detail */}
                <div className="pb-4 border-b border-border-color">
                  <p className="text-text-muted font-bold text-xs uppercase tracking-wider mb-1">Consulting Expert</p>
                  <p className="font-bold text-text-theme text-base">Dr. Lovely Priya</p>
                  <p className="text-xs text-text-muted mt-0.5">B.D.S., Special Educator</p>
                </div>

                {/* Date & Time detail */}
                <div className="pb-4 border-b border-border-color">
                  <p className="text-text-muted font-bold text-xs uppercase tracking-wider mb-1">Date & Time</p>
                  {selectedDate ? (
                    <div className="space-y-1.5">
                      <p className="font-bold text-text-theme flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-primary" /> {formatDateDisplay(selectedDate)}
                      </p>
                      {selectedTimeSlot ? (
                        <p className="font-bold text-secondary flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-secondary animate-pulse" /> {selectedTimeSlot} (IST)
                        </p>
                      ) : (
                        <p className="text-text-muted text-xs italic flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-500" /> Choose a time slot
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-text-muted text-xs italic flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-500" /> Select a date from calendar
                    </p>
                  )}
                </div>

                {/* Location detail - Clickable to Google Maps */}
                <div className="pb-4 border-b border-border-color">
                  <p className="text-text-muted font-bold text-xs uppercase tracking-wider mb-1">Clinic Address</p>
                  <a 
                    href="https://maps.app.goo.gl/P48Qe5iVSdP3yf8k6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-text-theme flex items-start gap-1.5 hover:text-primary transition-colors cursor-pointer group"
                    title="Open in Google Maps"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:animate-bounce" />
                    <span className="flex-grow">
                      Adarsh Vihar Colony, Lane 1, T-Point, Gola Road, Patna
                    </span>
                    <ExternalLink className="w-4.5 h-4.5 text-text-muted/60 hover:text-primary shrink-0 self-center ml-1" />
                  </a>
                </div>

                {/* Direct Booking Notice */}
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 space-y-1">
                  <p className="font-bold text-primary text-xs uppercase tracking-wider">Payment Bypassed</p>
                  <p className="font-bold text-text-theme text-sm">Direct Confirmation Booking</p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Razorpay has been fully removed. Your booking will confirm instantly and sync with Google Calendar.
                  </p>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookAppointment;
