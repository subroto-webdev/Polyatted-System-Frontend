import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Icon from '../components/common/Icon';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    shift: '', studentId: '', departmentId: '', semester: '', section: '',
    secretKey: ''
  });

  useEffect(() => {
    api.get('/departments/public').then(res => setDepartments(res.data.departments || [])).catch(() => { });
  }, []);

  const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Name, Email ও Password আবশ্যক');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error('সঠিক Email ঠিকানা দিন');
    if (form.password.length < 6) return toast.error('Password কমপক্ষে ৬ অক্ষর হতে হবে');
    if (role === 'teacher') {
      if (!form.shift) return toast.error('Shift দিন');
      if (!form.secretKey) return toast.error('Teacher Secret Key দিন'); // শুধু empty check
    }
    if (role === 'student' && (!form.studentId || !form.departmentId || !form.semester || !form.section || !form.shift)) {
      return toast.error('Student ID, Department, Semester, Section ও Shift দিন');
    }
    setLoading(true);
    try {
      await api.post('/auth/register-public', { ...form, role });
      toast.success('Registration সফল! Email verify করুন 📧');
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed'); // backend error এখানে দেখাবে
    } finally { setLoading(false); }
  };

  const ShiftSelector = () => (
    <div className="form-group">
      <label className="form-label">Shift *</label>
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { value: '1st', label: '🌅 1st Shift' },
          { value: '2nd', label: '🌙 2nd Shift' }
        ].map(s => (
          <button
            key={s.value}
            type="button"
            onClick={() => setForm(p => ({ ...p, shift: s.value }))}
            style={{
              flex: 1, padding: '12px 10px', borderRadius: 10,
              border: form.shift === s.value ? '2px solid var(--primary)' : '2px solid var(--border2)',
              background: form.shift === s.value ? 'var(--primary-light)' : 'var(--bg)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: form.shift === s.value ? 'var(--primary)' : 'var(--txt)' }}>
              {s.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 24, paddingBottom: 24 }}>
      <div className="auth-card" style={{ maxWidth: 420 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon"><Icon name="school" size={28} /></div>
          <h1 className="auth-title">নতুন Account</h1>
          <p className="auth-sub">PolyAttend-এ যোগ দিন</p>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { value: 'student', label: '🎓 Student', sub: 'Class attendance দেখুন' },
            { value: 'teacher', label: '👨‍🏫 Teacher', sub: 'Attendance নিন' },
          ].map(r => (
            <button key={r.value} type="button" onClick={() => { setRole(r.value); setForm(p => ({ ...p, shift: '', secretKey: '' })); }}
              style={{
                flex: 1, padding: '10px 12px', textAlign: 'left',
                border: `2px solid ${role === r.value ? 'var(--primary)' : 'var(--border2)'}`,
                borderRadius: 10,
                background: role === r.value ? 'var(--primary-light)' : 'var(--bg)',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: role === r.value ? 'var(--primary)' : 'var(--txt)' }}>{r.label}</div>
              <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>{r.sub}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">পূর্ণ নাম *</label>
            <input className="form-input" placeholder="আপনার পূর্ণ নাম" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set('email')}
              required
            />
            {form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
              <span style={{ color: 'red', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                সঠিক Email ঠিকানা দিন
              </span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="কমপক্ষে ৬ অক্ষর"
                value={form.password}
                onChange={set('password')}
                required
                style={{ paddingRight: 42 }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt3)' }}>
                <Icon name="eye" size={16} />
              </button>
            </div>
          </div>

          {/* Teacher Section */}
          {role === 'teacher' && (
            <>
              <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Teacher Information</div>
              <ShiftSelector />
              {/* ✅ Secret Key Field */}
              <div className="form-group">
                <label className="form-label">Teacher Secret Key *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    type={showSecretKey ? 'text' : 'password'}
                    placeholder="Admin প্রদত্ত Secret Key"
                    value={form.secretKey}
                    onChange={set('secretKey')}
                    required
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" onClick={() => setShowSecretKey(p => !p)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt3)' }}>
                    <Icon name="eye" size={16} />
                  </button>
                </div>
                <span style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 4, display: 'block' }}>
                  🔐 শুধুমাত্র অনুমোদিত Teacher রা register করতে পারবেন
                </span>
              </div>
            </>
          )}

          {/* Student Section */}
          {role === 'student' && (
            <>
              <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Student Information</div>
              <div className="form-group">
                <label className="form-label">Student ID *</label>
                <input className="form-input" placeholder="যেমন: CST-21-001" value={form.studentId} onChange={set('studentId')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select className="form-select" value={form.departmentId} onChange={set('departmentId')} required>
                  <option value="">-- Department বেছে নিন --</option>
                  {departments.map(d => <option key={d._id} value={d._id}>{d.name} ({d.code})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <select className="form-select" value={form.semester} onChange={set('semester')} required>
                    <option value="">--</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}th Sem</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Section *</label>
                  <select className="form-select" value={form.section} onChange={set('section')} required>
                    <option value="">--</option>
                    {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>
              <ShiftSelector />
            </>
          )}

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><div className="spinner spinner-sm" /> Registration হচ্ছে...</> : 'Register করুন →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--txt2)' }}>
          আগেই account আছে?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login করুন</Link>
        </p>
      </div>
    </div>
  );
}