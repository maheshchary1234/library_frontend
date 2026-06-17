import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  Brain, 
  Trophy, 
  MessageSquare, 
  BookOpen, 
  Flame, 
  Sparkles, 
  Plus, 
  FileText, 
  GraduationCap, 
  ArrowRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for Recommended Books
  const recommendedBooks = [
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      progress: 65,
      coverGradient: 'from-blue-600 to-indigo-850',
      category: 'Software Engineering'
    },
    {
      id: '2',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      progress: 20,
      coverGradient: 'from-purple-600 to-pink-850',
      category: 'Computer Science'
    },
    {
      id: '3',
      title: 'Design Patterns',
      author: 'Erich Gamma',
      progress: 85,
      coverGradient: 'from-emerald-600 to-teal-850',
      category: 'Architecture'
    }
  ];

  // Mock data for Recent Activities
  const recentActivities = [
    {
      id: 'act-1',
      type: 'quiz',
      title: "Completed 'Advanced JavaScript' Quiz",
      detail: 'Scored 92% • Earned 50 XP',
      time: '2 hours ago',
      colorClass: 'bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'act-2',
      type: 'flashcards',
      title: "Practiced 'Database Indexing' deck",
      detail: 'Reviewed 24 cards • 80% accuracy',
      time: '5 hours ago',
      colorClass: 'bg-blue-500/10 text-blue-400'
    },
    {
      id: 'act-3',
      type: 'chat',
      title: "Chat session with AI Tutor",
      detail: 'Discussed: Neural Network Backpropagation',
      time: 'Yesterday',
      colorClass: 'bg-purple-500/10 text-purple-400'
    },
    {
      id: 'act-4',
      type: 'book',
      title: "Started reading 'Clean Code'",
      detail: 'Read up to Chapter 2 (32 pages)',
      time: '2 days ago',
      colorClass: 'bg-pink-500/10 text-pink-400'
    }
  ];

  // Stats definition
  const stats = [
    {
      title: 'Total Study Time',
      value: '24.5 hrs',
      change: '+12% this week',
      isPositive: true,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/10'
    },
    {
      title: 'Flashcards Mastered',
      value: '142 / 200',
      change: '71% completion rate',
      isPositive: true,
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      shadowColor: 'shadow-purple-500/10'
    },
    {
      title: 'Average Quiz Score',
      value: '88%',
      change: 'Top 10% of cohort',
      isPositive: true,
      icon: Trophy,
      color: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/10'
    },
    {
      title: 'AI Tutor Chats',
      value: '18 sessions',
      change: '3 active topics',
      isPositive: true,
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/10'
    },
    {
      title: 'Library Books Read',
      value: '6 books',
      change: '2 currently reading',
      isPositive: true,
      icon: BookOpen,
      color: 'from-pink-500 to-rose-500',
      shadowColor: 'shadow-pink-500/10'
    },
    {
      title: 'Current Streak',
      value: '5 days',
      change: 'Personal best: 12 days',
      isPositive: true,
      icon: Flame,
      color: 'from-red-500 to-orange-500',
      shadowColor: 'shadow-red-500/10'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn select-none">
      
      {/* --- WELCOME HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent dark:from-white dark:to-slate-400">
            Welcome back, {user?.name || 'Mahesh'} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Here is your personalized study summary for today. Let's make it count!
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-center">
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white/5 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400">
            Summer Term 2026
          </span>
        </div>
      </div>

      {/* --- 6 STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-[2px] bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] border-slate-200 dark:border-white/[0.06] shadow-sm hover:shadow-md ${stat.shadowColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-lg`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight dark:text-white text-slate-800">
                {stat.value}
              </h3>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* --- MAIN GRIDS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CHARTS & RECOMMENDED BOOKS (SPAN 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STUDY ACTIVITY CHART */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-extrabold tracking-tight dark:text-white text-slate-800">
                  Study Activity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daily study hours logged this week</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-450">Study Hours</span>
              </div>
            </div>

            {/* Custom Responsive SVG Area Chart */}
            <div className="w-full h-56 mt-4">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.03)" className="dark:stroke-white/[0.03] stroke-slate-200/40" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.03)" className="dark:stroke-white/[0.03] stroke-slate-200/40" strokeWidth="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.03)" className="dark:stroke-white/[0.03] stroke-slate-200/40" strokeWidth="1" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="rgba(255,255,255,0.08)" className="dark:stroke-white/[0.08] stroke-slate-200" strokeWidth="1" />

                {/* Gradient Fill under the line */}
                <path 
                  d="M 10 160 C 45 150, 45 110, 80 110 C 130 110, 130 150, 160 150 C 200 150, 205 70, 240 70 C 275 70, 280 100, 320 100 C 360 100, 360 40, 400 40 C 440 40, 455 120, 490 120 L 490 190 L 10 190 Z" 
                  fill="url(#chart-glow)"
                />

                {/* Curved Connection Path */}
                <path 
                  d="M 10 160 C 45 150, 45 110, 80 110 C 130 110, 130 150, 160 150 C 200 150, 205 70, 240 70 C 275 70, 280 100, 320 100 C 360 100, 360 40, 400 40 C 440 40, 455 120, 490 120" 
                  fill="none" 
                  stroke="url(#gradient-line)" 
                  className="stroke-purple-500"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Glow filter path */}
                <path 
                  d="M 10 160 C 45 150, 45 110, 80 110 C 130 110, 130 150, 160 150 C 200 150, 205 70, 240 70 C 275 70, 280 100, 320 100 C 360 100, 360 40, 400 40 C 440 40, 455 120, 490 120" 
                  fill="none" 
                  className="stroke-purple-400/30 blur-[4px]"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Data point circle indicators */}
                <circle cx="10" cy="160" r="4.5" className="fill-purple-500 stroke-white dark:stroke-[#050816]" strokeWidth="2" />
                <circle cx="80" cy="110" r="4.5" className="fill-purple-500 stroke-white dark:stroke-[#050816]" strokeWidth="2" />
                <circle cx="160" cy="150" r="4.5" className="fill-purple-500 stroke-white dark:stroke-[#050816]" strokeWidth="2" />
                <circle cx="240" cy="70" r="4.5" className="fill-purple-500 stroke-white dark:stroke-[#050816]" strokeWidth="2" />
                <circle cx="320" cy="100" r="4.5" className="fill-purple-500 stroke-white dark:stroke-[#050816]" strokeWidth="2" />
                <circle cx="400" cy="40" r="4.5" className="fill-purple-500 stroke-white dark:stroke-[#050816]" strokeWidth="2" />
                <circle cx="490" cy="120" r="4.5" className="fill-purple-500 stroke-white dark:stroke-[#050816]" strokeWidth="2" />
              </svg>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between px-2.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* TWO GRAPHICS ROW: MEMORY RETENTION & RECOMMENDED BOOKS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SUBJECT RETENTION RATES */}
            <div className="p-6 rounded-2xl border bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] shadow-sm">
              <h3 className="text-base font-extrabold tracking-tight dark:text-white text-slate-800 mb-1">
                Subject Retention
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">AI-tracked syllabus memory strength</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="dark:text-slate-350 text-slate-650">Computer Science</span>
                    <span className="text-purple-400">92%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-250 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="dark:text-slate-350 text-slate-650">Mathematics</span>
                    <span className="text-blue-400">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-250 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="dark:text-slate-350 text-slate-650">Physics</span>
                    <span className="text-amber-400">78%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-250 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="dark:text-slate-350 text-slate-650">Literature</span>
                    <span className="text-pink-400">65%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-250 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECOMMENDED BOOKS SLIDER */}
            <div className="p-6 rounded-2xl border bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold tracking-tight dark:text-white text-slate-800">
                    Active Books
                  </h3>
                  <Link to="/books" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                    <span>Library</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {recommendedBooks.map((book) => (
                    <div 
                      key={book.id}
                      className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-all border border-slate-100 dark:border-transparent cursor-pointer"
                      onClick={() => navigate('/books')}
                    >
                      {/* Cover representation */}
                      <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${book.coverGradient} shadow-md shrink-0 flex items-center justify-center p-1 text-[8px] font-black text-white/80 text-center leading-tight`}>
                        {book.title.substring(0, 8)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold dark:text-white text-slate-800 truncate">
                          {book.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {book.author}
                        </p>
                        {/* Linear Progress Indicator */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="h-1 flex-1 rounded-full bg-slate-200 dark:bg-white/5 overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${book.progress}%` }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{book.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & RECENT ACTIVITY (SPAN 1) */}
        <div className="space-y-6">
          
          {/* QUICK ACTIONS */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] shadow-sm">
            <h3 className="text-base font-extrabold tracking-tight dark:text-white text-slate-800 mb-4">
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              
              <button 
                onClick={() => navigate('/tutor')}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left bg-gradient-to-r hover:from-[#8B5CF6]/5 hover:to-[#3B82F6]/5 dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:border-purple-500/20 group"
              >
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold dark:text-white text-slate-800">Start Study Session</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450">Review notes with AI Tutor help</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/flashcards')}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left bg-gradient-to-r hover:from-[#8B5CF6]/5 hover:to-[#3B82F6]/5 dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:border-purple-500/20 group"
              >
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                  <Brain className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold dark:text-white text-slate-800">Generate Flashcards</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450">Convert textbook summaries into cards</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/quiz')}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left bg-gradient-to-r hover:from-[#8B5CF6]/5 hover:to-[#3B82F6]/5 dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:border-purple-500/20 group"
              >
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold dark:text-white text-slate-800">Take Adaptive Quiz</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450">Test retention and repair weak spots</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/library')}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left bg-gradient-to-r hover:from-[#8B5CF6]/5 hover:to-[#3B82F6]/5 dark:border-white/[0.06] border-slate-200 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:border-purple-500/20 group"
              >
                <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400 group-hover:scale-105 transition-transform shrink-0">
                  <Plus className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold dark:text-white text-slate-800">Upload Textbooks</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450">Add PDFs and study notes files</p>
                </div>
              </button>

            </div>
          </div>

          {/* RECENT ACTIVITY LOGS */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] shadow-sm">
            <h3 className="text-base font-extrabold tracking-tight dark:text-white text-slate-800 mb-4">
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg ${act.colorClass} flex items-center justify-center shrink-0 text-xs font-bold`}>
                    {act.type === 'quiz' && 'Q'}
                    {act.type === 'flashcards' && 'F'}
                    {act.type === 'chat' && 'C'}
                    {act.type === 'book' && 'B'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold dark:text-slate-200 text-slate-800 truncate">
                      {act.title}
                    </h4>
                    <p className="text-[10px] text-slate-550 dark:text-slate-450 truncate">
                      {act.detail}
                    </p>
                    <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
