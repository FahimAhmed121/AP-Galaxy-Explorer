import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  KeyRound,
  ChevronRight
} from 'lucide-react';
import { AuthService } from '../../services/auth/AuthService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

type AuthTab = 'signin' | 'signup' | 'reset';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  if (!isOpen) return null;

  const resetFormState = () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(false);
  };

  const handleTabSwitch = (tab: AuthTab) => {
    setActiveTab(tab);
    resetFormState();
  };

  const handleGoogleSignIn = async () => {
    resetFormState();
    setLoading(true);
    try {
      await AuthService.signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await AuthService.signInWithEmail(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    if (!email || !password) {
      setError('Please enter an email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      await AuthService.signUpWithEmail(email, password, displayName);
      setSuccessMessage('Account created! A verification email has been sent to your address.');
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    if (!email) {
      setError('Please enter your email address to reset password.');
      return;
    }
    setLoading(true);
    try {
      await AuthService.sendPasswordReset(email);
      setSuccessMessage(`Password reset instructions sent to ${email}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!currentUser) return;
    resetFormState();
    setLoading(true);
    try {
      await AuthService.sendEmailVerification(currentUser);
      setSuccessMessage('Verification email resent! Please check your inbox.');
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    resetFormState();
    setLoading(true);
    try {
      await AuthService.signOut();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Top Glow & Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-cyan-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-wide font-mono">
              {currentUser ? 'COMMAND PILOT PROFILE' : 'EXPLORER AUTHENTICATION'}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              {currentUser
                ? 'Cloud Save & Cross-Device Telemetry Sync'
                : 'Authenticate to enable Cloud Save across star systems'}
            </p>
          </div>
        </div>

        {/* If User Already Authenticated */}
        {currentUser ? (
          <div className="space-y-5">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full border border-cyan-500/50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-lg">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser.email
                      ? currentUser.email.charAt(0).toUpperCase()
                      : 'P'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-semibold text-slate-100 truncate">
                    {currentUser.displayName || 'Cosmic Explorer'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                </div>
              </div>

              {/* Email Verification Status for Email/Pass users */}
              {!currentUser.emailVerified && currentUser.providerData.some((p) => p.providerId === 'password') && (
                <div className="mt-3 p-3 bg-amber-950/40 border border-amber-500/40 rounded-lg flex items-start gap-2 text-xs text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Email not verified</p>
                    <p className="text-amber-300/80 text-[11px]">
                      Verify your email address to secure cloud synchronization.
                    </p>
                    <button
                      id="resend-verification-btn"
                      onClick={handleResendVerification}
                      disabled={loading || verificationSent}
                      className="mt-1 text-cyan-400 hover:underline font-mono text-[11px] flex items-center gap-1 disabled:opacity-50"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {verificationSent ? 'Verification Sent' : 'Resend Verification Email'}
                    </button>
                  </div>
                </div>
              )}

              {currentUser.emailVerified && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Account Verified • Cloud Sync Active</span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              id="auth-signout-btn"
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-2.5 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 rounded-xl text-rose-200 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>TERMINATE SESSION (SIGN OUT)</span>
            </button>
          </div>
        ) : (
          /* Unauthenticated Mode */
          <div className="space-y-4">
            {/* OAuth Google Button */}
            <button
              id="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-950/80 hover:bg-slate-800/80 border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-slate-100 font-mono text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-md group disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.8-.7-1.3-1.6-1.6-2.6z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors ml-auto" />
            </button>

            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-slate-800" />
              <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                or email credentials
              </span>
              <div className="flex-grow border-t border-slate-800" />
            </div>

            {/* Auth Tab Selector */}
            <div className="flex p-1 bg-slate-950/90 rounded-xl border border-slate-800 font-mono text-xs">
              <button
                id="auth-tab-signin"
                onClick={() => handleTabSwitch('signin')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'signin'
                    ? 'bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                id="auth-tab-signup"
                onClick={() => handleTabSwitch('signup')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'signup'
                    ? 'bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Register
              </button>
              <button
                id="auth-tab-reset"
                onClick={() => handleTabSwitch('reset')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'reset'
                    ? 'bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Reset
              </button>
            </div>

            {/* Notifications */}
            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Sign In Form */}
            {activeTab === 'signin' && (
              <form onSubmit={handleEmailSignIn} className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">PILOT EMAIL</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      id="auth-signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@astronomy.org"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">ACCESS KEY (PASSWORD)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      id="auth-signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  id="auth-signin-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>AUTHENTICATE</span>
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleEmailSignUp} className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">CALLSIGN (DISPLAY NAME)</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      id="auth-signup-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Astro Explorer"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">EMAIL ADDRESS</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      id="auth-signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@astronomy.org"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">ACCESS KEY (MIN 6 CHARACTERS)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      id="auth-signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  id="auth-signup-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>CREATE ACCOUNT</span>
                </button>
              </form>
            )}

            {/* Password Reset Form */}
            {activeTab === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">REGISTERED PILOT EMAIL</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      id="auth-reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@astronomy.org"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  id="auth-reset-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>DISPATCH RESET LINK</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
