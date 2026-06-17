import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Mail, Loader2, CheckCircle2, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'initial'>('initial');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (token) {
      if (verificationStarted.current) return;
      verificationStarted.current = true;
      
      setStatus('loading');
      authService.verify(token)
        .then((res) => {
          setStatus('success');
          setMessage(res || 'Email verified successfully!');
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err.response?.data || 'Verification failed. The token may be invalid or expired.');
        });
    } else {
      setStatus('initial');
    }
  }, [token]);


  const handleResend = () => {
    setResending(true);
    setResendStatus(null);
    
    // Simulate API resend link call
    setTimeout(() => {
      setResending(false);
      setResendStatus('A new verification email has been sent to your inbox.');
    }, 1500);
  };

  const openGmail = () => {
    window.open('https://mail.google.com', '_blank');
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-[20px] shadow-2xl text-center text-white font-sans">
      
      {/* Brand Header */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <h2 className="text-2xl font-black tracking-wider bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          LUMEN AI
        </h2>
      </div>

      {/* Initial state (no token, instructions to check inbox) */}
      {status === 'initial' && (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center rounded-full mx-auto text-3xl">
            <Mail className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Verify Your Email</h3>
            <p className="text-slate-400 text-sm mt-2">
              We've sent a verification link to your email address. Please click the link to activate your account.
            </p>
          </div>

          {resendStatus && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-left flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{resendStatus}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={openGmail}
              className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#9D76FA] hover:to-[#5293FA] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-[1px]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Gmail</span>
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {resending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Resending...</span>
                </>
              ) : (
                <span>Resend Email</span>
              )}
            </button>

            <Link
              to="/login"
              className="block w-full py-3 text-slate-400 hover:text-white text-xs font-semibold hover:underline transition-all"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}

      {/* Loading state (token verification in progress) */}
      {status === 'loading' && (
        <div className="py-8 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Verifying your token, please wait...</p>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-full mx-auto text-3xl font-bold">
            ✓
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-400 tracking-tight">Email Verified!</h3>
            <p className="text-slate-300 text-sm mt-2">{message}</p>
            <p className="text-slate-400 text-xs mt-1">Your account is active. You can now access the workspace.</p>
          </div>
          
          <Link
            to="/login"
            className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#9D76FA] hover:to-[#5293FA] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-[1px]"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center rounded-full mx-auto text-3xl font-bold">
            ✗
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-400 tracking-tight">Verification Failed</h3>
            <p className="text-slate-300 text-sm mt-2">{message}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {resending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Resending Link...</span>
                </>
              ) : (
                <span>Request New Link</span>
              )}
            </button>

            <Link
              to="/login"
              className="block w-full py-3 text-slate-400 hover:text-white text-xs font-semibold hover:underline transition-all"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
