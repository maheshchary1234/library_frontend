import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Github, User } from 'lucide-react';

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

interface LoginFormProps {
  isDark?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isDark = true }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

  // Login form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Register form fields
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if redirect has verified=true parameter
    if (searchParams.get('verified') === 'true') {
      setSuccess('Email address verified successfully! You can now log in.');
    }
  }, [searchParams]);

  // Pre-fill email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleTabChange = (tab: 'login' | 'register') => {
    setSearchParams({ tab });
    setError(null);
    setSuccess(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      setSuccess('Login successful! Redirecting to dashboard...');
      
      setTimeout(() => {
        login(response.token, response.email, response.name);
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const message = await authService.register({ name, email, password });
      setSuccess(message || 'Account created successfully! Redirecting to email verification page...');
      
      // Clear registration specific fields
      setName('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/verify');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform: 'Google' | 'GitHub') => {
    setError(null);
    setSuccess(null);
    setSocialLoading(platform);
    
    // Simulate OAuth redirect
    setTimeout(() => {
      setSocialLoading(null);
      setSuccess(`Redirecting to ${platform} for authentication...`);
    }, 1200);
  };

  return (
    <div className={`w-full p-8 rounded-[20px] backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
      isDark 
        ? 'bg-white/[0.03] border-white/[0.08] shadow-black/40 text-white' 
        : 'bg-white/80 border-slate-200/80 shadow-slate-200/50 text-slate-800'
    }`}>
      
      {/* High-Fidelity Tabs */}
      <div className={`flex border-b mb-8 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <button
          type="button"
          onClick={() => handleTabChange('login')}
          className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'login'
              ? isDark 
                ? 'border-purple-500 text-white' 
                : 'border-purple-600 text-slate-900'
              : isDark 
                ? 'border-transparent text-slate-400 hover:text-slate-200' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign In
          {activeTab === 'login' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 blur-[2px]"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('register')}
          className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'register'
              ? isDark 
                ? 'border-purple-500 text-white' 
                : 'border-purple-600 text-slate-900'
              : isDark 
                ? 'border-transparent text-slate-400 hover:text-slate-200' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign Up
          {activeTab === 'register' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 blur-[2px]"></span>
          )}
        </button>
      </div>

      {/* Headings */}
      <div className="mb-6 text-center md:text-left">
        <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {activeTab === 'login' 
            ? 'Sign in to access your AI study companion' 
            : 'Sign up for a free Lumen AI study account'}
        </p>
      </div>

      {/* Status Banners */}
      {error && (
        <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {activeTab === 'login' ? (
        /* Sign In Form */
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </span>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/10 text-white placeholder-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`block text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`} htmlFor="login-password">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/10 text-white placeholder-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <label 
              htmlFor="remember-me" 
              className={`ml-2 block text-xs font-medium cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || socialLoading !== null}
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#9D76FA] hover:to-[#5293FA] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      ) : (
        /* Sign Up Form */
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} htmlFor="register-name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-slate-400" />
              </span>
              <input
                id="register-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/10 text-white placeholder-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} htmlFor="register-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </span>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/10 text-white placeholder-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} htmlFor="register-password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </span>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/10 text-white placeholder-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-250 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </span>
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/10 text-white placeholder-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-250 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#9D76FA] hover:to-[#5293FA] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="my-6 flex items-center justify-center gap-3">
        <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
        <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Or Continue With
        </span>
        <div className={`h-[1px] flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          disabled={loading || socialLoading !== null}
          className={`flex items-center justify-center gap-2.5 py-2.5 border rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 ${
            isDark 
              ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06] text-white' 
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm'
          }`}
        >
          {socialLoading === 'Google' ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
          ) : (
            <GoogleIcon className="w-4 h-4" />
          )}
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          disabled={loading || socialLoading !== null}
          className={`flex items-center justify-center gap-2.5 py-2.5 border rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 ${
            isDark 
              ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06] text-white' 
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm'
          }`}
        >
          {socialLoading === 'GitHub' ? (
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
          ) : (
            <Github className="w-4 h-4" />
          )}
          <span>GitHub</span>
        </button>
      </div>

      {/* Bottom Switcher Link */}
      <div className={`mt-8 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {activeTab === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => handleTabChange('register')}
              className="font-bold text-purple-400 hover:text-purple-300 hover:underline transition-all"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => handleTabChange('login')}
              className="font-bold text-purple-400 hover:text-purple-300 hover:underline transition-all"
            >
              Sign In
            </button>
          </>
        )}
      </div>

    </div>
  );
};
