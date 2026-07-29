import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail, ArrowLeft, ArrowRight, Cpu, Send,
  KeyRound, ShieldCheck, Zap, Users, CheckCircle
} from 'lucide-react';
import './Login.css';

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) { setError('Please enter your email address'); return; }

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const result = requestPasswordReset(email.trim());
      setSuccess(result.message);
      setIsSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-effects">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-grid-bg" />
      </div>

      <div className="login-wrapper">
        {/* Left panel */}
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <div className="login-logo"><Cpu size={28} /></div>
            <h1 className="login-brand-title">Reset Your<br />Password</h1>
            <p className="login-brand-desc">
              No worries — it happens to the best of us. Enter your email and we'll send you instructions to reset your password.
            </p>
            <div className="login-features">
              <div className="login-feature">
                <div className="login-feature-icon"><KeyRound size={16} /></div>
                <div>
                  <span className="login-feature-title">Secure Reset</span>
                  <span className="login-feature-desc">Time-limited reset link</span>
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon"><ShieldCheck size={16} /></div>
                <div>
                  <span className="login-feature-title">Email Verification</span>
                  <span className="login-feature-desc">Only you can reset</span>
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon"><Zap size={16} /></div>
                <div>
                  <span className="login-feature-title">Instant Delivery</span>
                  <span className="login-feature-desc">Check your inbox</span>
                </div>
              </div>
            </div>
          </div>
          <div className="login-brand-footer">
            <span>© 2024 EPS. All rights reserved.</span>
          </div>
        </div>

        {/* Right panel */}
        <div className="login-form-panel">
          <div className="login-form-container">
            <Link to="/login" className="login-back-link">
              <ArrowLeft size={16} /> Back to sign in
            </Link>

            {!isSent ? (
              <>
                <div className="login-form-header">
                  <h2>Forgot password?</h2>
                  <p>Enter your email address and we'll send you a reset link</p>
                </div>

                {error && <div className="login-error" role="alert"><span>{error}</span></div>}

                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="login-field">
                    <label htmlFor="forgot-email">Email Address</label>
                    <div className="login-input-wrapper">
                      <Mail size={18} className="login-input-icon" />
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@company.com"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="login-spinner" />
                    ) : (
                      <>
                        <Send size={18} />
                        Send Reset Link
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success state */
              <div style={{ textAlign: 'center', paddingTop: 'var(--space-xl)' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto var(--space-xl)',
                  background: 'var(--success-bg)', border: '2px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'fadeIn 0.5s ease'
                }}>
                  <CheckCircle size={36} color="var(--success)" />
                </div>
                <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
                  Check your email
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-base)', marginBottom: 'var(--space-lg)', lineHeight: 1.7 }}>
                  We've sent a password reset link to<br />
                  <strong style={{ color: 'var(--primary-light)' }}>{email}</strong>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-xl)' }}>
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSent(false); setSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontFamily: 'var(--font-family)', fontSize: 'var(--font-sm)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }}
                  >
                    try again
                  </button>.
                </p>
                <Link to="/login" className="login-submit-btn" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '12px 28px' }}>
                  <ArrowLeft size={16} /> Return to Sign In
                </Link>
              </div>
            )}

            {!isSent && (
              <>
                <div className="login-divider"><span>or</span></div>
                <div className="login-register-link">
                  Remember your password?{' '}
                  <Link to="/login">Sign in</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
