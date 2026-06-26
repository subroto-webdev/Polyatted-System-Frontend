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
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'কোড পাঠাতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-emerald-100 via-white to-green-100
      relative overflow-hidden
    ">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="absolute w-80 h-80 bg-green-400/20 rounded-full blur-3xl bottom-0 right-0"></div>


      <div className="
        relative w-full max-w-md
        bg-white/80 backdrop-blur-xl
        border border-white
        rounded-3xl
        shadow-[0_20px_50px_rgba(0,0,0,0.12)]
        p-7 md:p-9
        transition-all duration-500
        hover:shadow-[0_25px_60px_rgba(16,185,129,0.25)]
      ">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="
            mx-auto mb-5
            w-16 h-16
            rounded-2xl
            flex items-center justify-center
            text-white
            bg-gradient-to-br from-emerald-600 to-green-400
            shadow-lg shadow-emerald-500/40
          ">
            <Icon name="lock" size={30} />
          </div>


          <h2 className="
            text-3xl font-extrabold
            text-slate-800
            tracking-tight
          ">
            Forgot Password?
          </h2>


          <p className="
            text-sm text-slate-500
            mt-3 leading-6
          ">
            আপনার অ্যাকাউন্টের রেজিস্টার্ড ইমেইল দিন।
            আমরা পাসওয়ার্ড রিসেট করার জন্য একটি OTP পাঠাব।
          </p>

        </div>



        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">


          <div>

            <label className="
              block mb-2
              text-sm font-semibold
              text-slate-700
            ">
              Email Address
            </label>


            <div className="relative group">

              <span className="
                absolute left-4 top-1/2
                -translate-y-1/2
                text-slate-400
                group-focus-within:text-emerald-600
                transition
              ">
                <Icon name="mail" size={18} />
              </span>


              <input
                type="email"
                required
                placeholder="your@email.edu"
                className="
                  w-full
                  pl-11 pr-4 py-3
                  rounded-2xl
                  bg-white
                  border border-slate-200
                  text-sm
                  text-slate-700

                  outline-none

                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/20

                  transition-all duration-300

                  placeholder:text-slate-400
                "
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
            className="
              w-full
              py-3.5

              rounded-2xl

              bg-gradient-to-r
              from-emerald-600
              via-green-600
              to-emerald-700

              text-white
              font-bold
              text-sm

              shadow-lg
              shadow-emerald-600/30

              hover:scale-[1.02]
              hover:shadow-xl

              active:scale-95

              transition-all duration-300

              disabled:opacity-60
              disabled:hover:scale-100

              flex items-center justify-center gap-2
            "
            style={{
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >

            {loading ? (
              <>
                <div className="
                  w-5 h-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "/>

                কোড পাঠানো হচ্ছে...
              </>
            ) : (
              <>
                Send OTP Code →
              </>
            )}

          </button>


        </form>



        {/* Footer */}
        <div className="mt-7 text-center">

          <Link
            to="/login"
            className="
              inline-flex items-center gap-2

              text-sm
              font-semibold
              text-slate-500

              hover:text-emerald-600

              transition-colors

              no-underline
            "
          >

            <Icon name="chevronLeft" size={15} />

            Back to Sign In

          </Link>

        </div>


      </div>

    </div>
  );
}