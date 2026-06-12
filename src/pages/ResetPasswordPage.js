import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Icon from '../components/common/Icon';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email if passed in state from ForgotPasswordPage
  const initialEmail = location.state?.email || '';

  const [form, setForm] = useState({
    email: initialEmail,
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, otp, newPassword, confirmPassword } = form;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return toast.error('সবগুলো ফিল্ড পূরণ করুন');
    }
    if (newPassword.length < 6) {
      return toast.error('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('পাসওয়ার্ড দুটি মেলেনি');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      toast.success(res.data?.message || 'পাসওয়ার্ড পরিবর্তন সফল হয়েছে! 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে। ওটিপি চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-50 via-slate-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-100 max-w-md w-full p-6 md:p-8 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-md shadow-amber-500/20">
            <Icon name="refresh" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Reset Password</h2>
          <p className="text-sm text-slate-500 mt-2">
            আপনার ইমেইলে পাঠানো ওটিপি কোড এবং নতুন পাসওয়ার্ড দিয়ে সাবমিট করুন।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-600">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Icon name="mail" size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="your@email.edu"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                autoComplete="email"
              />
            </div>
          </div>

          {/* OTP Code */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-600">6-Digit OTP Code</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Icon name="check" size={16} />
              </span>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                value={form.otp}
                onChange={e => setForm(p => ({ ...p, otp: e.target.value.replace(/\D/g, '') }))}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-600">New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Icon name="lock" size={16} />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                value={form.newPassword}
                onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Icon name="eye" size={16} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-600">Confirm New Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Icon name="lock" size={16} />
              </span>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                value={form.confirmPassword}
                onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(p => !p)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Icon name="eye" size={16} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold text-sm hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-600/10 hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            style={{ border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                রিসেট হচ্ছে...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1.5 no-underline">
            <Icon name="chevronLeft" size={14} /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
