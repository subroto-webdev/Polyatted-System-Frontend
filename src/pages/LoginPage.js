import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/common/Icon';
import api from '../utils/api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', message: '' });
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Email ও Password দিন');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`স্বাগতম, ${user.name}! 🎉`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. তথ্য যাচাই করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.email || !feedbackForm.message) {
      return toast.error('সবগুলো ফিল্ড পূরণ করুন');
    }
    setFeedbackLoading(true);
    try {
      await api.post('/feedback', feedbackForm);
      toast.success('ফিডব্যাক সফলভাবে জমা দেওয়া হয়েছে! ধন্যবাদ।');
      setFeedbackForm({ name: '', email: '', message: '' });
      setShowFeedbackModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Feedback submission failed.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Icon name="school" size={28} />
          </div>
          <h1 className="auth-title">PolyAttend</h1>
          <p className="auth-sub">Polytechnic Attendance Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="your@email.edu"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--txt3)'
                }}
              >
                <Icon name="eye" size={16} />
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><div className="spinner spinner-sm" /> লগইন হচ্ছে...</> : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--txt2)' }}>
          নতুন account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register করুন
          </Link>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button
            type="button"
            onClick={() => setShowFeedbackModal(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--primary)', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
            }}
          >
            <Icon name="chat" size={14} /> Need Help? Give Feedback
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowFeedbackModal(false)}>
          <div className="modal-sheet" style={{ maxWidth: 420 }}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h3 className="modal-title" style={{ marginBottom: 0 }}>Need Help or Have Feedback?</h3>
              <button onClick={() => setShowFeedbackModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt3)', display: 'flex', padding: 4 }}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--txt2)', marginBottom: 16 }}>লগইন সমস্যা বা কোনো মতামত থাকলে আমাদের জানান।</p>

            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label className="form-label">আপনার নাম</label>
                <input type="text" required className="form-input" placeholder="John Doe"
                  value={feedbackForm.name} onChange={e => setFeedbackForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">ইমেইল এড্রেস</label>
                <input type="email" required className="form-input" placeholder="john@example.com"
                  value={feedbackForm.email} onChange={e => setFeedbackForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">আপনার মেসেজ</label>
                <textarea required rows={4} className="form-input"
                  placeholder="আপনার সমস্যা বা মতামত এখানে লিখুন..."
                  style={{ resize: 'none', height: 'auto' }}
                  value={feedbackForm.message} onChange={e => setFeedbackForm(p => ({ ...p, message: e.target.value }))} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowFeedbackModal(false)}>বাতিল</button>
                <button type="submit" className="btn-primary" disabled={feedbackLoading}>
                  {feedbackLoading ? <><div className="spinner spinner-sm" /> জমা হচ্ছে...</> : 'ফিডব্যাক জমা দিন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}