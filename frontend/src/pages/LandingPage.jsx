import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import {
  Coffee, Monitor, ChefHat, CreditCard, BarChart3,
  Sparkles, ArrowRight
} from 'lucide-react';

const features = [
  { icon: Monitor, label: 'Smart POS Register' },
  { icon: ChefHat, label: 'Live KDS Tracking' },
  { icon: CreditCard, label: 'Digital Payments' },
  { icon: BarChart3, label: 'Advanced Reports' },
];

const LandingPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-cream via-white to-primary/5 flex flex-col font-sans">
      {/* Header */}
      <nav className="glass px-6 py-4 shadow-sm border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
            <Link to="/signup"><Button size="sm" className="shadow-md shadow-primary/25">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Soft Background Globs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 -right-20 w-[400px] h-[400px] bg-gold/15 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider self-center lg:self-start">
              <Sparkles size={14} className="text-primary animate-pulse" />
              Cafe Management System
            </div>
            
            <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              The Digital Heartbeat of Your <span className="text-primary font-bold">Cafe</span>.
            </h1>
            
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              CafeVibes is a modern Restaurant POS and Live Kitchen Monitor built specifically for coffee shops. Manage billing, table plans, kitchen tickets, and business metrics in real-time.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
              {features.map(({ icon: Icon, label }) => (
                <span key={label} className="badge bg-white/80 text-gray-700 border border-gray-150 shadow-sm flex items-center py-1.5 px-3 rounded-full text-xs font-medium">
                  <Icon size={13} className="mr-1.5 text-primary" />
                  {label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group">
                  Register Cafe
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full bg-white border border-gray-200">
                  Login Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Dashboard Mockup Column */}
          <div className="lg:col-span-7 relative flex justify-center hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-lg bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-2xl space-y-6 animate-float"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Live POS Terminal</div>
              </div>

              {/* Grid layout */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7 space-y-4">
                  <h3 className="font-semibold text-base text-gray-800">Popular Items</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-cream border border-gold/20 flex flex-col justify-between h-24 shadow-sm">
                      <span className="text-2xl">☕</span>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Cappuccino</p>
                        <p className="text-sm font-bold text-primary">₹180</p>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-cream border border-gold/20 flex flex-col justify-between h-24 shadow-sm">
                      <span className="text-2xl">🍵</span>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Matcha Latte</p>
                        <p className="text-sm font-bold text-primary">₹220</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Receipt Panel */}
                <div className="col-span-5 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between min-h-[190px]">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ticket #204</p>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>1x Cappuccino</span>
                        <span className="font-semibold">₹180</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1x Matcha</span>
                        <span className="font-semibold">₹220</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-xs font-bold text-gray-850">
                      <span>Total</span>
                      <span>₹400</span>
                    </div>
                    <button className="w-full mt-3 py-2 bg-primary text-white rounded-xl text-[10px] font-bold shadow-md hover:bg-primary-700 transition-colors">
                      Print Receipt
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Float Badges */}
            <div className="absolute -top-6 -left-6 glass rounded-2xl p-3.5 shadow-xl border border-white/50 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-9 h-9 rounded-xl bg-green-500 text-white flex items-center justify-center">
                <ChefHat size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold">KDS Sync</p>
                <p className="text-xs font-bold text-gray-800">Live Queue</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-3.5 shadow-xl border border-white/50 flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold">Analytics</p>
                <p className="text-xs font-bold text-gray-800">Daily Sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer minimal */}
      <footer className="py-4 px-6 border-t border-gray-100 z-50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© 2026 CafeVibes Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
