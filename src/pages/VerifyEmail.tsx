import React from 'react';
import { VerifyEmail as VerifyEmailComponent } from '../components/auth/VerifyEmail';
import { Sparkles, FileText, Brain, GraduationCap, TrendingUp } from 'lucide-react';
import aiRobotBooks from '../assets/ai_robot_books.png';

export const VerifyEmail: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050816] text-white font-sans select-none">
      
      {/* Left Showcase Panel - Hidden on Mobile */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#050816] via-[#0b0c26] to-[#170e3b] border-r border-white/[0.05] relative overflow-hidden">
        
        {/* Glow ambient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Brand Area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-xl shadow-lg shadow-purple-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              LUMEN AI
            </h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">
              AI Study Assistant
            </p>
          </div>
        </div>

        {/* Feature Graphic Area */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="relative p-1 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-sm shadow-2xl max-w-sm overflow-hidden animate-float">
            <img 
              src={aiRobotBooks} 
              alt="Lumen AI Illustration" 
              className="w-full h-auto rounded-[22px] object-cover mix-blend-screen"
            />
          </div>
        </div>

        {/* Feature Highlight List */}
        <div className="relative z-10 space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
            Study Smarter, Not Harder
          </h3>
          <div className="grid grid-cols-1 gap-3">
            
            <div className="flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/[0.06] rounded-xl transition-all duration-300 group">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">AI Summaries</h4>
                <p className="text-xs text-gray-400">Convert complex textbooks and notes into structured briefs.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/[0.06] rounded-xl transition-all duration-300 group">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Interactive Flashcards</h4>
                <p className="text-xs text-gray-400">Active recall decks generated dynamically from your syllabus.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/[0.06] rounded-xl transition-all duration-300 group">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Adaptive AI Quizzes</h4>
                <p className="text-xs text-gray-400">Custom quizzes targeting your weak areas with rich explanations.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/[0.06] rounded-xl transition-all duration-300 group">
              <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Progress Insights</h4>
                <p className="text-xs text-gray-400">Visual feedback loops to track memory retention and score stats.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
        
        {/* Glow ambient background sphere */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 flex flex-col items-center">
          {/* Logo for mobile view (hidden on desktop) */}
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="p-2.5 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black tracking-wider text-white">
                LUMEN AI
              </h1>
              <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
                AI Study Assistant
              </p>
            </div>
          </div>

          <VerifyEmailComponent />
        </div>

      </div>

    </div>
  );
};
