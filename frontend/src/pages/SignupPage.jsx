import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import AuthIllustration from '../components/auth/AuthIllustration';
import FormInput from '../components/ui/FormInput';
import GoogleButton from '../components/auth/GoogleButton';
import Logo from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'At least 6 characters';
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setServerError('');
    setLoading(true);
    try {
      const { user } = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate(user.role === 'admin' ? '/dashboard' : '/pos');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setServerError('Google signup requires GOOGLE_CLIENT_ID configuration.');
  };

  return (
    <div className="flex min-h-screen w-full bg-cream">
      <AuthIllustration
        title="Set up CafeVibes in minutes"
        subtitle="Configure products, tables, and your team — your POS is ready before your first order."
      />

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl border border-white/40 p-8"
          >
            <h1 className="font-display text-2xl font-semibold text-coffee">Create account</h1>
            <p className="mt-1 text-sm text-coffee/60">
              The first account you create becomes the cafe admin.
            </p>

            {serverError && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormInput
                id="name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="Alex Johnson"
                icon={<FiUser />}
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
              />
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="you@cafevibes.com"
                icon={<FiMail />}
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />
              <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="At least 6 characters"
                icon={<FiLock />}
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
              />
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                icon={<FiLock />}
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-white shadow-glass transition hover:bg-teal-dark disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <FiArrowRight />}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-coffee/10" />
              <span className="text-xs text-coffee/40">OR</span>
              <div className="h-px flex-1 bg-coffee/10" />
            </div>

            <GoogleButton label="Continue with Google" onClick={handleGoogleSignup} />

            <p className="mt-6 text-center text-sm text-coffee/60">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
