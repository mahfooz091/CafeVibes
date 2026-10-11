import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Coffee, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import API_URL from '../utils/constants';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/dashboard' : '/pos');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="h-screen overflow-hidden flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-coffee to-coffee/80 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-50 h-50 rounded-full bg-gold/30" />
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-white/20" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-white max-w-md space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden p-1.5">
            <img src="/logo.png" alt="CafeVibes Logo" className="w-full h-full object-cover scale-[1.5] -translate-y-[10%]" />
          </div>
          <h1 className="font-display text-4xl font-bold">Join CafeVibes</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Create your account and transform how you manage your cafe with our all-in-one POS platform.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['POS System', 'Kitchen Display', 'Analytics', 'Payments'].map((t) => (
              <div key={t} className="glass-dark rounded-xl p-3 text-sm text-center text-white/90">{t}</div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-cream">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-5"
        >
          <div className="lg:hidden text-center">
            <h1 className="font-display text-2xl font-bold text-primary">CafeVibes</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Start your cafe management journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-cream text-gray-500">or</span></div>
          </div>

          <Button variant="secondary" className="w-full" onClick={handleGoogle} type="button">
            Continue with Google
          </Button>

          <div className="text-center text-sm space-y-2">
            <p className="text-gray-500">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary text-sm">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
