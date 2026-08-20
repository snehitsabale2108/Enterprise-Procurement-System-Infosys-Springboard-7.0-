import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LogIn, Mail, Lock, Eye, EyeOff, Cpu,
  ShieldCheck, ArrowRight, Zap, Users
} from 'lucide-react';
import './Login.css';

const Login = () => {
  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address'); return; }
    if (!password) { setError('Please enter your password'); return; }
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // simulate network delay
      loginWithCredentials(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };





  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg-effects">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-grid-bg" />
      </div>

      <div className="login-wrapper">
        {/* Left panel — Branding */}
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <div className="login-logo">
              <Cpu size={28} />
            </div>
            <h1 className="login-brand-title">Enterprise<br />Procurement<br />System</h1>
            <p className="login-brand-desc">
              Streamline your procurement lifecycle with role-based workflows, real-time analytics, and complete audit trails.
            </p>
            <div className="login-features">
              <div className="login-feature">
                <div className="login-feature-icon"><Zap size={16} /></div>
                <div>
                  <span className="login-feature-title">Smart Workflows</span>
                  <span className="login-feature-desc">Automated approval chains</span>
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon"><Users size={16} /></div>
                <div>
                  <span className="login-feature-title">12 User Roles</span>
                  <span className="login-feature-desc">Granular access control</span>
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon"><ShieldCheck size={16} /></div>
                <div>
                  <span className="login-feature-title">Full Audit Trail</span>
                  <span className="login-feature-desc">Track every action</span>
                </div>
              </div>
            </div>
          </div>
          <div className="login-brand-footer">
            <span>© 2024 EPS. All rights reserved.</span>
          </div>
        </div>

        {/* Right panel — Login Form */}
        <div className="login-form-panel">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2>Welcome back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span>{error}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="login-email">Email Address</label>
                <div className="login-input-wrapper">
                  <Mail size={18} className="login-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@company.com"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-field-header">
                  <label htmlFor="login-password">Password</label>
                  <Link to="/forgot-password" className="login-forgot-link">Forgot password?</Link>
                </div>
                <div className="login-input-wrapper">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
                    <LogIn size={18} />
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            <div className="login-register-link">
              Don't have an account?{' '}
              <Link to="/register">Create an account</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
