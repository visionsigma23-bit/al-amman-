import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Lock, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../../components/SEOHead';

export function AdminLoginPage() {
  const {
    user,
    isAdmin,
    authLoading,
    authError,
    siteContent,
    signInWithEmail,
    sendPasswordReset,
    signInWithGoogle,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7F9]">
        <Loader2 className="w-6 h-6 animate-spin text-[#101B2D]" />
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user && !isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email.trim() || !password) {
      setLocalError('Please enter both your administrator email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : 'Sign-in failed. Verify your email, password, and Firebase Email/Password provider settings.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setResetSuccess(null);
    if (!email.trim()) {
      setLocalError('Please enter your administrator email address.');
      return;
    }
    setSubmitting(true);
    try {
      await sendPasswordReset(email);
      setResetSuccess(
        `Password reset instructions have been sent to ${email.trim()} if an account exists.`
      );
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : 'Unable to send password reset email.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading || submitting) return;
    setLocalError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setGoogleLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <>
      <SEOHead
        title={`Admin Login – ${siteContent.companyName}`}
        description={`Secure administrator sign-in for ${siteContent.companyName}.`}
      />

      <div className="min-h-screen bg-[#101B2D] flex flex-col justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-3 text-white">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <rect x="2" y="2" width="28" height="28" stroke="#C5A15B" strokeWidth="1.5" />
                <path d="M9 23V12L16 7L23 12V23" stroke="currentColor" strokeWidth="1.75" />
                <path d="M13 23V16H19V23" stroke="#C5A15B" strokeWidth="1.5" />
              </svg>
              <span className="font-display text-2xl font-semibold tracking-tight">
                {siteContent.companyName}
              </span>
            </Link>
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C5A15B]">
              Administrator Portal
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-7 sm:p-9 shadow-xl space-y-6">
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-semibold text-[#101B2D]">
                {mode === 'login' ? 'Sign In to Dashboard' : 'Reset Password'}
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                {mode === 'login'
                  ? 'Authorized administrators may sign in with Email & Password or Google.'
                  : 'Enter your registered administrator email to receive a reset link.'}
              </p>
            </div>

            {displayError && (
              <div
                role="alert"
                className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed"
              >
                {displayError}
              </div>
            )}

            {resetSuccess && (
              <div
                role="status"
                className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resetSuccess}</span>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-xs font-semibold text-[#101B2D] mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="admin-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@alamaandevelopers.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-semibold text-[#101B2D]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setLocalError(null);
                        setResetSuccess(null);
                      }}
                      className="text-xs font-medium text-[#A98642] hover:text-[#101B2D] cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="admin-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-5 bg-[#101B2D] hover:bg-[#1A2A44] disabled:opacity-60 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-semibold text-[#101B2D] mb-1.5"
                  >
                    Administrator Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@alamaandevelopers.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-5 bg-[#101B2D] hover:bg-[#1A2A44] disabled:opacity-60 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Send Password Reset Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLocalError(null);
                  }}
                  className="w-full py-2 text-xs font-medium text-slate-600 hover:text-[#101B2D] cursor-pointer"
                >
                  Back to Sign In
                </button>
              </form>
            )}

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2.5 text-slate-400">or</span>
              </div>
            </div>

            <button
              type="button"
              disabled={googleLoading || submitting}
              onClick={() => void handleGoogleSignIn()}
              className="w-full py-2.5 px-5 border border-slate-300 hover:border-[#101B2D] disabled:opacity-60 text-[#101B2D] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {googleLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {googleLoading
                  ? 'Opening Google Sign-In...'
                  : 'Continue with Google (Authorized Admin)'}
              </span>
            </button>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#101B2D]">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Website</span>
              </Link>
              <span>Firebase Auth Protected</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
