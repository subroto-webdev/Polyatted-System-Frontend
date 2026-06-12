import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Icon from '../components/common/Icon';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('আপনার রেজিস্টার্ড ইমেইল এড্রেসটি দিন');
    
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      toast.success(res.data?.message || 'রিসেট কোড ইমেইলে পাঠানো হয়েছে!');
      // Navigate to reset password and pass email in state
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'কোড পাঠাতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-50 via-slate-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-100 max-w-md w-full p-6 md:p-8 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-md shadow-emerald-600/20">
            <Icon name="lock" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Forgot Password?</h2>
          <p className="text-sm text-slate-500 mt-2">
            আপনার অ্যাকাউন্টের রেজিস্টার্ড ইমেইল দিন। আমরা পাসওয়ার্ড রিসেট করার জন্য একটি ওটিপি (OTP) পাঠাব।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold text-sm hover:from-emerald-700 hover:to-emerald-855 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-600/10 hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            style={{ border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                কোড পাঠানো হচ্ছে...
              </>
            ) : (
              'Send OTP Code →'
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
