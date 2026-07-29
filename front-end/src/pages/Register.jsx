import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { departments } from '../data/mockData';
import {
  UserPlus, Mail, Lock, Eye, EyeOff, User, Building2,
  ArrowLeft, ArrowRight, Cpu, Zap, ShieldCheck, Users
} from 'lucide-react';
import './Login.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', department: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (key, value) => { setForm(prev => ({ ...prev, [key]: value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('Please enter your full name'); return; }
    if (!form.email.trim()) { setError('Please enter your email address'); return; }
    if (!form.password) { setError('Please create a password'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      register(form.name.trim(), form.email.trim(), form.password, form.department);
      navigate('/dashboard');
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
            <h1 className="login-brand-title">Join the<br />Procurement<br />Platform</h1>
            <p className="login-brand-desc">
              Create your account to start submitting procurement requests, tracking approvals, and managing your department's spending.
            </p>
            <div className="login-features">
              <div className="login-feature">
                <div className="login-feature-icon"><Zap size={16} /></div>
                <div>
                  <span className="login-feature-title">Instant Setup</span>
                  <span className="login-feature-desc">Start in under a minute</span>
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon"><Users size={16} /></div>
                <div>
                  <span className="login-feature-title">Team Collaboration</span>
                  <span className="login-feature-desc">Work with your department</span>
                </div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon"><ShieldCheck size={16} /></div>
                <div>
                  <span className="login-feature-title">Secure by Default</span>
                  <span className="login-feature-desc">Enterprise-grade security</span>
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

            <div className="login-form-header">
              <h2>Create an account</h2>
              <p>Fill in your details to get started</p>
            </div>

            {error && <div className="login-error" role="alert"><span>{error}</span></div>}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="reg-name">Full Name</label>
                <div className="login-input-wrapper">
                  <User size={18} className="login-input-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    value={form.name}
                    onChange={e => updateForm('name', e.target.value)}
                    placeholder="Enter your full name"
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="reg-email">Email Address</label>
                <div className="login-input-wrapper">
                  <Mail size={18} className="login-input-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={e => updateForm('email', e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="reg-dept">Department</label>
                <div className="login-input-wrapper">
                  <Building2 size={18} className="login-input-icon" />
                  <select
                    id="reg-dept"
                    value={form.department}
                    onChange={e => updateForm('department', e.target.value)}
                    style={{ paddingLeft: 44, appearance: 'none', background: 'var(--bg-input)', width: '100%', padding: '13px 16px 13px 44px', fontSize: 'var(--font-base)', fontFamily: 'var(--font-family)', color: form.department ? 'var(--text-primary)' : 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select your department</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="reg-password">Password</label>
                <div className="login-input-wrapper">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => updateForm('password', e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <div className="login-input-wrapper">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => updateForm('confirmPassword', e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
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
                    <UserPlus size={18} />
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="login-terms">
              By creating an account, you agree to our{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </div>

            <div className="login-divider"><span>or</span></div>

            <div className="login-register-link">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
