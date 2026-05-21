import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Flower, 
  Award, 
  Trash2, 
  Plus, 
  Activity,
  Heart,
  Printer
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Growth Garden & Milestone States
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem(`ssc-milestones-${user?._id}`);
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Practiced sensory deep breaths at home', date: 'Yesterday' },
      { id: '2', text: 'Successfully stacked 5 block levels without anxiety', date: '2 days ago' }
    ];
  });
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Star Jar state
  const starsCount = Math.min((appointments.length * 2) + milestones.length, 12);

  // Questionnaire States
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    focus: 5,
    motor: 5,
    sensory: 5,
    social: 5
  });
  const [showChart, setShowChart] = useState(false);

  const questions = [
    { key: 'focus', title: 'Focus & Cognitive Agility', text: 'How easily does your child sustain attention on single games or tasks?' },
    { key: 'motor', title: 'Motor & Daily Coordination', text: 'How coordinated does your child feel during stacking, cutting, or sketching?' },
    { key: 'sensory', title: 'Sensory Balance', text: 'How balanced are your child\'s reactions to high noises, light, or sudden touches?' },
    { key: 'social', title: 'Social & Play Connection', text: 'How comfortably does your child cooperate or share toys during small-group play?' }
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/appointments/my');
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Save milestones to LocalStorage
  const saveMilestones = (updated) => {
    setMilestones(updated);
    localStorage.setItem(`ssc-milestones-${user?._id}`, JSON.stringify(updated));
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;

    const newObj = {
      id: Date.now().toString(),
      text: newMilestoneText.trim(),
      date: 'Just now'
    };
    saveMilestones([newObj, ...milestones]);
    setNewMilestoneText('');
  };

  const handleDeleteMilestone = (id) => {
    const filtered = milestones.filter(m => m.id !== id);
    saveMilestones(filtered);
  };

  const handleAnswerChange = (key, val) => {
    setAnswers({ ...answers, [key]: parseInt(val) });
  };

  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setShowChart(true);
    }
  };

  const handleResetQuestionnaire = () => {
    setQuestionIndex(0);
    setShowChart(false);
  };

  // Certificate printing function
  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Child Achievement Certificate</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Playfair+Display:ital,wght@1,600&display=swap');
            body {
              margin: 0;
              padding: 40px;
              background-color: #FFF9F0;
              color: #2E3A3E;
              font-family: 'Outfit', sans-serif;
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
              height: calc(100vh - 80px);
            }
            .border-wrap {
              border: 15px solid #FFB347;
              border-image: linear-gradient(to right, #FFB347, #87CEEB, #98FF98) 15;
              padding: 50px;
              background-color: #FFFFFF;
              max-width: 800px;
              width: 100%;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
              position: relative;
            }
            h1 {
              font-family: 'Playfair Display', serif;
              font-size: 50px;
              color: #FFB347;
              margin: 0 0 10px 0;
              font-style: italic;
            }
            h2 {
              font-size: 18px;
              text-transform: uppercase;
              letter-spacing: 4px;
              color: #5D6D7E;
              margin: 0 0 40px 0;
            }
            p.presented {
              font-size: 16px;
              color: #5D6D7E;
              margin: 0 0 15px 0;
            }
            h3.name {
              font-size: 38px;
              color: #2E3A3E;
              border-bottom: 2px dashed #B8E1FF;
              display: inline-block;
              padding: 0 30px 10px 30px;
              margin: 0 0 30px 0;
            }
            p.reason {
              font-size: 18px;
              line-height: 1.6;
              max-width: 600px;
              margin: 0 auto 50px auto;
              color: #2E3A3E;
            }
            .footer-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 50px;
            }
            .sig {
              width: 200px;
              border-top: 1px solid #5D6D7E;
              padding-top: 10px;
              font-size: 14px;
              color: #5D6D7E;
            }
            .seal {
              font-size: 32px;
            }
          </style>
        </head>
        <body>
          <div class="border-wrap">
            <div class="seal">🌿</div>
            <h1>Certificate of Bloom</h1>
            <h2>Special Smile Center</h2>
            <p class="presented">This certificate is proudly awarded to</p>
            <h3 class="name">${user?.name || 'A Brave Learner'}</h3>
            <p class="reason">
              For exceptional perseverance, learning curiosity, and joyful milestone achievements in pediatric developmental therapy & occupational milestones. Dr. Lovely Priya celebrates your brightness!
            </p>
            <div class="footer-row">
              <div class="sig">
                <strong>Dr. Lovely Priya</strong><br/>
                B.D.S., Special Educator
              </div>
              <div class="sig">
                <strong>Special Smile Center</strong><br/>
                Patna, Bihar
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="pt-32 text-center text-text-theme bg-bg-theme min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Tending to your Growth Garden...</p>
      </div>
    );
  }

  // Pure SVG Radar polygon coordinates based on child answers
  const focusVal = (answers.focus / 10) * 80;
  const motorVal = (answers.motor / 10) * 80;
  const sensoryVal = (answers.sensory / 10) * 80;
  const socialVal = (answers.social / 10) * 80;

  // Radar points: Focus (top), Motor (right), Sensory (bottom), Social (left)
  // Center is at (100, 100)
  const pFocus = `${100}, ${100 - focusVal}`;
  const pMotor = `${100 + motorVal}, ${100}`;
  const pSensory = `${100}, ${100 + sensoryVal}`;
  const pSocial = `${100 - socialVal}, ${100}`;
  const polygonPoints = `${pFocus} ${pMotor} ${pSensory} ${pSocial}`;

  return (
    <div className="py-24 bg-bg-theme min-h-screen text-text-theme overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 animate-spin-slow" /> Parent Growth Panel
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight">
              Welcome, {user?.name.split(' ')[0]} 🌸
            </h1>
            <p className="text-sm text-text-muted mt-1">Nurturing your child's capabilities, day by day.</p>
          </div>
          <div className="bg-surface-theme/80 border border-primary/20 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-sm flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted font-bold uppercase">Account Access</p>
              <p className="text-sm font-semibold leading-tight mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Top Widgets Grid: Garden & Star Jar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Growth Garden Seedlings */}
          <div className="lg:col-span-2 card bg-surface-theme border border-secondary/15 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                  <Flower className="w-5 h-5 text-secondary animate-bounce" />
                  Growth Garden Milestones
                </h2>
                <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-bold">
                  {milestones.length} Seeded
                </span>
              </div>
              <p className="text-xs text-text-muted mb-6">
                Log cute milestones at home to watch virtual therapeutic blossoms sprout in your parent dashboard!
              </p>

              {/* Garden Blossoms Visualizer */}
              <div className="grid grid-cols-6 gap-3 p-4 rounded-2xl bg-secondary/5 border border-secondary/10 mb-6 justify-center text-center">
                {milestones.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-theme border border-secondary/20 flex items-center justify-center text-lg shadow-sm">
                      {idx % 3 === 0 ? '🌸' : idx % 3 === 1 ? '🌻' : '🌷'}
                    </div>
                    <span className="text-[9px] text-text-muted font-semibold truncate w-12 block">{m.text}</span>
                  </motion.div>
                ))}
                {milestones.length === 0 && (
                  <div className="col-span-6 py-4 text-xs text-text-muted italic">
                    Your garden is empty. Add a home milestone below!
                  </div>
                )}
              </div>

              {/* Add Milestone Form */}
              <form onSubmit={handleAddMilestone} className="flex gap-2">
                <input
                  type="text"
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  className="flex-grow input-field py-2.5 text-sm bg-surface-theme border border-border-color rounded-xl"
                  placeholder="e.g. Spoke 3 clear sentences today!"
                />
                <button
                  type="submit"
                  className="btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1 shrink-0 rounded-xl"
                >
                  <Plus className="w-4 h-4" /> Seed
                </button>
              </form>
            </div>

            {/* Milestones Log List */}
            <div className="mt-6 max-h-48 overflow-y-auto space-y-2.5 pr-2">
              <AnimatePresence>
                {milestones.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex justify-between items-center p-3 rounded-xl bg-surface-theme/60 border border-border-color text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌱</span>
                      <div>
                        <p className="font-semibold text-text-theme">{m.text}</p>
                        <p className="text-[9px] text-text-muted mt-0.5">{m.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="text-text-muted hover:text-red-500 p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Star Jar Component */}
          <div className="card bg-surface-theme border border-primary/20 rounded-3xl p-6 flex flex-col justify-between items-center text-center">
            <div className="w-full">
              <h2 className="text-xl font-bold font-heading flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                The Star Jar
              </h2>
              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Accumulate stars for attending therapy and documenting family milestones! Unlock printables at 5 stars.
              </p>
            </div>

            {/* Visual Glass Jar */}
            <div className="relative w-36 h-48 border-[6px] border-text-theme/40 bg-surface-theme/20 rounded-t-3xl rounded-b-[2rem] flex flex-wrap items-center justify-center p-4 content-end gap-1.5 shadow-inner my-2">
              {/* Wooden jar cap */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-3.5 bg-yellow-900 border-2 border-text-theme/40 rounded-full shadow-md z-10" />

              {/* Glowing Stars Inside */}
              {[...Array(starsCount)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -3, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 3 + i % 2, repeat: Infinity, delay: i * 0.2 }}
                  className="text-yellow-400 text-2xl drop-shadow-md select-none"
                >
                  ⭐
                </motion.div>
              ))}

              {starsCount === 0 && (
                <div className="text-[10px] text-text-muted italic self-center mb-6">
                  Jar is empty.
                </div>
              )}
            </div>

            <div className="w-full mt-4">
              <p className="text-[10px] text-text-muted font-bold mb-3 uppercase tracking-wider">
                🌟 Total Stars Gathered: {starsCount}
              </p>
              
              {starsCount >= 5 ? (
                <button
                  onClick={handlePrintCertificate}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-md hover:scale-102 active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Achievement Certificate
                </button>
              ) : (
                <div className="bg-primary/5 border border-primary/20 p-2.5 rounded-xl text-[10px] text-text-muted leading-tight font-medium">
                  🔒 Earn {5 - starsCount} more stars to bloom child certificate!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Lower Grid: Appointments List & Strengths Questionnaire */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Middle: Appointments */}
          <div className="lg:col-span-2 card bg-surface-theme border border-border-color rounded-3xl p-6">
            <h2 className="text-xl font-bold font-heading text-text-theme mb-6">Upcoming Appointments</h2>
            
            {appointments.length === 0 ? (
              <div className="text-center py-12 bg-secondary/5 rounded-2xl border border-dashed border-secondary/20">
                <Calendar className="w-12 h-12 text-secondary/40 mx-auto mb-4" />
                <p className="text-text-muted text-sm mb-4">You have no upcoming appointments booked.</p>
                <a href="/book" className="btn-secondary inline-flex text-xs">Book a Session</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((apt, index) => (
                  <motion.div 
                    key={apt._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-surface-theme/60 border border-border-color hover:border-primary/45 transition-colors flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {apt.status}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary-dark">
                          Active Slot
                        </span>
                      </div>
                      
                      <h3 className="font-bold font-heading text-base leading-snug">{apt.service?.title || 'Therapy Session'}</h3>
                      <p className="text-xs text-text-muted mt-1">For child: <span className="font-bold text-text-theme">{apt.childName}</span></p>
                    </div>
                    
                    <div className="space-y-1.5 text-xs text-text-muted border-t border-border-color/30 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-secondary" />
                        <span className="font-semibold text-text-theme">{apt.timeSlot}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Child Strengths Questionnaire */}
          <div className="card bg-surface-theme border border-accent/20 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold font-heading flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-accent animate-pulse" />
                Strengths Questionnaire
              </h2>
              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Understand your child's superpowers through Dr. Lovely Priya's clinical focus categories.
              </p>

              {!showChart ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-accent/5 border border-accent/15">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">
                      Question {questionIndex + 1} of 4: {questions[questionIndex].title}
                    </span>
                    <p className="text-xs text-text-theme font-semibold leading-relaxed">
                      {questions[questionIndex].text}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-text-muted font-bold">
                      <span>Needs Practice</span>
                      <span>Super Strong</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={answers[questions[questionIndex].key]}
                      onChange={(e) => handleAnswerChange(questions[questionIndex].key, e.target.value)}
                      className="w-full accent-accent cursor-pointer h-1.5 bg-accent/20 rounded-lg appearance-none"
                    />
                    <div className="text-center font-bold text-sm text-accent">
                      Score: {answers[questions[questionIndex].key]} / 10
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {/* Beautiful Custom SVG Radar Chart */}
                  <svg className="w-48 h-48" viewBox="0 0 200 200">
                    {/* Background rings */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(46, 58, 62, 0.06)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(46, 58, 62, 0.06)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(46, 58, 62, 0.06)" strokeWidth="1" />
                    
                    {/* Axes lines */}
                    <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(46, 58, 62, 0.06)" strokeWidth="1" />
                    <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(46, 58, 62, 0.06)" strokeWidth="1" />

                    {/* Radar polygon shape */}
                    <polygon
                      points={polygonPoints}
                      fill="rgba(152, 255, 152, 0.35)"
                      stroke="#98FF98"
                      strokeWidth="2.5"
                    />

                    {/* Category Label dots */}
                    <circle cx="100" cy={100 - focusVal} r="4" fill="#FFB347" />
                    <circle cx={100 + motorVal} cy="100" r="4" fill="#87CEEB" />
                    <circle cx="100" cy={100 + sensoryVal} r="4" fill="#98FF98" />
                    <circle cx={100 - socialVal} cy="100" r="4" fill="#FFB347" />

                    {/* Labels */}
                    <text x="100" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">Focus</text>
                    <text x="185" y="103" textAnchor="end" fontSize="8" fontWeight="bold" fill="currentColor">Motor</text>
                    <text x="100" y="195" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">Sensory</text>
                    <text x="15" y="103" textAnchor="start" fontSize="8" fontWeight="bold" fill="currentColor">Social</text>
                  </svg>
                  
                  <div className="mt-4 p-3 bg-accent/5 rounded-xl text-[10px] text-text-muted leading-snug text-center border border-accent/15">
                    🌸 Beautiful shape! Your child displays wonderful natural strengths. Practice together at home to expand the bounds.
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              {!showChart ? (
                <button
                  onClick={handleNextQuestion}
                  className="w-full btn-secondary text-xs font-bold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {questionIndex === questions.length - 1 ? 'Calculate Superpower Shape' : 'Next Category'}
                </button>
              ) : (
                <button
                  onClick={handleResetQuestionnaire}
                  className="w-full btn-outline text-xs font-bold py-2.5 border-accent text-accent hover:bg-accent/10 cursor-pointer"
                >
                  Restart Assessment
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
