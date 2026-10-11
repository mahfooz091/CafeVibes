import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Coffee, ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import API_URL from '../utils/constants';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/dashboard' : '/pos');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemo = async () => {
    setDemoLoading('admin');
    try {
      await demoLogin('admin');
      toast.success('Welcome to CafeVibes Admin Demo (Read-Only Mode)!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin demo login failed');
    } finally {
      setDemoLoading(null);
    }
  };

  const handleCustomerDemo = async () => {
    setDemoLoading('customer');
    try {
      await demoLogin('customer');
      toast.success('Welcome to CafeVibes Customer Demo!');
      navigate('/customer-demo');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Customer demo login failed');
    } finally {
      setDemoLoading(null);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="h-screen overflow-hidden flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white/10" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-white max-w-md space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden p-1.5">
            <img src="/logo.png" alt="CafeVibes Logo" className="w-full h-full object-cover scale-[1.5] -translate-y-[10%]" />
          </div>
          <h1 className="font-display text-4xl font-bold">Welcome Back</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Sign in to manage your cafe operations, track orders, and grow your business with CafeVibes.
          </p>
          <div className="glass-dark rounded-2xl p-6 space-y-3">
            {['Real-time order tracking', 'Smart analytics', 'Seamless payments'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-cream">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="lg:hidden text-center mb-4">
            <h1 className="font-display text-2xl font-bold text-primary">CafeVibes</h1>
            <p className="text-sm text-gray-500">The Digital Heartbeat of Your Cafe</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          {/* Quick Visitor Demo Access Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-primary/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-500/20 text-amber-700">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 tracking-wide uppercase">
                    Visitor Demo Access
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Explore live cafe features with 1-click
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Read-Only Tour
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                onClick={handleAdminDemo}
                loading={demoLoading === 'admin'}
                className="w-full bg-primary hover:bg-primary-600 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer font-semibold text-xs py-2.5"
              >
                <Sparkles size={14} className="text-amber-300" />
                Admin Demo
              </Button>
              <Button
                type="button"
                onClick={handleCustomerDemo}
                loading={demoLoading === 'customer'}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer font-semibold text-xs py-2.5"
              >
                <ShoppingBag size={14} className="text-amber-200" />
                Customer Demo
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
              <span>🔒 Changes disabled & isolated</span>
              <Link to="/demo" className="text-primary hover:underline font-semibold">
                Explore Demo Hub →
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>Login</Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-cream text-gray-500">or</span></div>
          </div>

          <Button variant="secondary" className="w-full" onClick={handleGoogle} type="button">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </span>
          </Button>

          <div className="text-center text-sm space-y-2">
            <p className="text-gray-500">
              Don&apos;t have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Create Account</Link>
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

export default Login;
