import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Brain, 
  GraduationCap, 
  Book, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell, 
  Sun, 
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Theme state synced with documentElement class and localStorage
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Sidebar states
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Library', path: '/library', icon: FolderOpen },
    { name: 'AI Tutor', path: '/tutor', icon: GraduationCap },
    { name: 'Flashcards', path: '/flashcards', icon: Brain },
    { name: 'Quiz', path: '/quiz', icon: HelpCircle },
    { name: 'Books', path: '/books', icon: Book },
  ];

  // Helper to determine active link
  const isActive = (path: string) => location.pathname === path;

  // Get initial letters of user's name
  const getUserInitial = () => {
    if (!user || !user.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${
      isDark ? 'bg-[#050816] text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Glow Ambient Orbs (Background decoration) */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-600/[0.03] rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/[0.03] rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`hidden md:flex flex-col shrink-0 border-r transition-all duration-300 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        isDark 
          ? 'bg-[#070a1e]/80 border-white/[0.06] backdrop-blur-xl' 
          : 'bg-white border-slate-200'
      }`}>
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/[0.06] dark:border-white/[0.06] border-slate-200">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden select-none">
            <div className="p-2 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-xl shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-wider bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  LUMEN AI
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                  Study Assistant
                </span>
              </div>
            )}
          </Link>
          
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(true)}
              className={`p-1 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed Reveal Button */}
        {isCollapsed && (
          <div className="flex justify-center py-4">
            <button 
              onClick={() => setIsCollapsed(false)}
              className={`p-1.5 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                  active 
                    ? 'bg-gradient-to-r from-purple-500/15 to-blue-500/10 text-purple-400 border border-purple-500/20' 
                    : isDark 
                      ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                  active ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                {!isCollapsed && <span>{item.name}</span>}
                {!isCollapsed && active && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/[0.06] dark:border-white/[0.06] border-slate-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              isDark 
                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/5' 
                : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5 text-slate-400 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setIsMobileOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></div>
          
          {/* Sidebar content */}
          <aside className={`relative w-72 flex flex-col h-full border-r ${
            isDark ? 'bg-[#070a1e] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="h-20 flex items-center justify-between px-5 border-b border-white/[0.06] dark:border-white/[0.06] border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-xl">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-wider bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    LUMEN AI
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Study Assistant
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className={`p-1.5 rounded-lg border ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-grow px-3 py-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active 
                        ? 'bg-gradient-to-r from-purple-500/15 to-blue-500/10 text-purple-400 border border-purple-500/20' 
                        : isDark 
                          ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/[0.06] dark:border-white/[0.06] border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="w-5 h-5 text-slate-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN PAGE COLUMN --- */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        
        {/* --- NAVBAR --- */}
        <header className={`h-20 flex items-center justify-between px-6 border-b shrink-0 transition-colors duration-300 ${
          isDark 
            ? 'bg-[#050816]/70 border-white/[0.06] backdrop-blur-md' 
            : 'bg-white/80 border-slate-200 backdrop-blur-md'
        }`}>
          {/* Menu Switch / Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className={`p-2 rounded-xl border md:hidden transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <div className="relative hidden sm:block w-72 md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-450" />
              </span>
              <input
                type="text"
                placeholder="Search resources, topics, flashcards..."
                className={`w-full pl-10 pr-4 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/10 text-white placeholder-slate-500 focus:bg-white/[0.05]' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-yellow-400' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-purple-650'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications */}
            <button
              className={`p-2.5 rounded-xl border relative transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Divider */}
            <div className={`h-6 w-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>

            {/* Profile Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] p-[1px] shadow-lg shadow-purple-500/10">
                <div className="w-full h-full rounded-[11px] bg-slate-900 flex items-center justify-center text-white text-sm font-black select-none">
                  {getUserInitial()}
                </div>
              </div>
              
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {user?.name || 'Mahesh'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-450 font-medium">
                  {user?.email || 'mahesh@lumenai.com'}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* --- ROUTED CONTENT WRAPPER --- */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          {children}
        </main>
      </div>

    </div>
  );
};
