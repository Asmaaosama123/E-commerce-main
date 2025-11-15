import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // ✅ أضيفي ده

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'enter-number' | 'enter-otp'>('enter-number');
  const [whatsapp, setWhatsapp] = useState('+222'); 
  const [nameValue, setNameValue] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ هنا

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/request-otp', { whatsapp, name: nameValue });
      setStep('enter-otp');
      toast.success('تم إرسال كود التفعيل');
    } catch (err: unknown) {
      let msg = 'فشل إرسال الكود، تأكد من أن الرقم مسجل وصحيح';
      if (err && typeof err === 'object' && 'response' in err) {
        const r = (err as { response?: { data?: { message?: unknown } } }).response;
        if (r && r.data && r.data.message) msg = String(r.data.message);
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { whatsapp, otp });
      login(data.token, data.user); 
      toast.success('تم تسجيل الدخول بنجاح');

      if (data.user.role === "vendor") {
        navigate('/my-store');
      } else {
        navigate('/category/women');
      } // ✅ توجيه المستخدم تلقائيًا للصفحة الرئيسية
    } catch (err: unknown) { 
      let msg = 'الكود غير صحيح أو انتهت صلاحيته';
      if (err && typeof err === 'object' && 'response' in err) {
        const r = (err as { response?: { data?: { message?: unknown } } }).response;
        if (r && r.data && r.data.message) msg = String(r.data.message);
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Auto-focus OTP input when switching to the OTP step
  const otpRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (step === 'enter-otp') {
      setTimeout(() => otpRef.current?.focus(), 50);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">مرحبًا بك</h1>
          <p className="text-gray-500 mt-2">سجل الدخول للمتابعة</p>
        </div>

        {step === 'enter-number' ? (
          <form onSubmit={handleRequestOtp}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-right mb-2">
                الاسم الكامل
              </label>
              <input
                id="name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                placeholder="أدخل اسمك"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 text-right mb-2">
                رقم الواتساب
              </label>
              <input
                type="tel"
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                placeholder="+22212345678"
                required
                dir="ltr"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال كود التفعيل'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-center text-sm text-gray-600 mb-4">
              تم إرسال كود التفعيل إلى <span className="font-bold" dir="ltr">{whatsapp}</span>
            </p>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-right mb-2">
                كود التفعيل
              </label>
              <input
                ref={otpRef}
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-center tracking-[1em] border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
            <button
              type="button"
              onClick={() => { setError(''); setStep('enter-number'); }}
              className="w-full mt-2 text-sm text-gray-600 hover:text-black"
            >
              تغيير الرقم
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
