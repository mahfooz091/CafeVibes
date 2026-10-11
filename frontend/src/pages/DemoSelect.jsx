import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, ArrowRight, LayoutDashboard, ShoppingBag, CheckCircle2,
  Lock, ArrowLeft, Monitor, ChefHat, BarChart3, Tag, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';

const DemoSelect = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [loadingMode, setLoadingMode] = useState(null);

  const handleLaunchAdminDemo = async () => {
    try {
      setLoadingMode('admin');
      await demoLogin('admin');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to start admin demo session', err);
    } finally {
      setLoadingMode(null);
    }
  };

  const handleLaunchCustomerDemo = async () => {
    try {
      setLoadingMode('customer');
      await demoLogin('customer');
      navigate('/customer-demo');
    } catch (err) {
      console.error('Failed to start customer demo session', err);
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-amber-50/50 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Navigation */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Logo size="md" />
        <Link
          to="/"
          className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Back to Website
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8">
        <div className="text-center space-y-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm"
          >
            <ShieldCheck size={16} className="text-amber-700" />
            Demo Environment — Safe & Isolated Exploration
          </motion.div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Choose Your CafeVibes Experience
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Explore our restaurant management platform and customer storefront with 1-click access.
            Changes are disabled and no real transactions will be processed.
          </p>
        </div>

        {/* Two Prominent Demo Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Admin & Operations Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border-2 border-primary/20 hover:border-primary/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5 flex flex-col justify-between transition-all group"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <LayoutDashboard size={28} />
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Operations & POS
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  Explore Admin Demo
                </h2>
                <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">
                  View the full back-of-house restaurant management system with real-time analytics,
                  live cashier POS terminal, kitchen display tickets, and table layouts.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <BarChart3 size={16} className="text-primary flex-shrink-0" />
                  <span>Real-time Sales & Revenue Analytics Dashboard</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <Monitor size={16} className="text-primary flex-shrink-0" />
                  <span>Interactive POS Terminal & Cash Drawer Shifts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <ChefHat size={16} className="text-primary flex-shrink-0" />
                  <span>Live Kitchen Display System (KDS) Tickets</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <Tag size={16} className="text-primary flex-shrink-0" />
                  <span>Menu, Categories, Tables & Staff Management</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <Button
                size="lg"
                onClick={handleLaunchAdminDemo}
                loading={loadingMode === 'admin'}
                className="w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group cursor-pointer"
              >
                <Sparkles size={18} className="text-amber-300" />
                Launch Admin Demo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[11px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Lock size={12} /> Read-only mode: synthetic data, mutations disabled
              </p>
            </div>
          </motion.div>

          {/* Card 2: Customer Storefront Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border-2 border-amber-300/40 hover:border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-600/5 flex flex-col justify-between transition-all group"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-700">
                  <ShoppingBag size={28} />
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  Guest Storefront
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-amber-800 transition-colors">
                  Explore Customer Demo
                </h2>
                <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">
                  Experience the cafe website exactly as a normal customer would: browse artisanal coffees,
                  filter categories, customize items, and try a simulated checkout.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                  <span>Artisanal Coffee, Tea & Bakery Menu Browsing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                  <span>Instant Search & Dietary/Category Filtering</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                  <span>Item Customization & Interactive Local Cart Drawer</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
                  <span>Simulated Checkout & Live Order Status Stepper</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <Button
                size="lg"
                onClick={handleLaunchCustomerDemo}
                loading={loadingMode === 'customer'}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingBag size={18} className="text-amber-200" />
                Launch Customer Demo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[11px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Lock size={12} /> Local cart & simulated checkout — no real payments
              </p>
            </div>
          </motion.div>
        </div>

        {/* Security and Isolation Guarantee Box */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm border border-gray-200/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-600">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 flex-shrink-0">
            <Lock size={20} />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <p className="font-semibold text-gray-800">
              Strict Isolation & Zero Production Mutations
            </p>
            <p className="text-gray-500 leading-normal">
              Demo sessions run on an isolated server-controlled data layer with synthetic records.
              Mutations are permanently blocked with HTTP 403 Forbidden. Your real administrator credentials
              and database remain 100% confidential and untouched.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign In to Real Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-3 border-t border-gray-200/60 text-xs text-gray-500">
        CafeVibes — Restaurant POS & Digital Kitchen Management
      </footer>
    </div>
  );
};

export default DemoSelect;
