import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Home, Compass, ShoppingBag, ArrowLeft } from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-amber-50/40 flex flex-col justify-between p-6">
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <Logo size="md" />
        <Link
          to="/"
          className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Back to Website
        </Link>
      </header>

      <main className="max-w-2xl w-full mx-auto text-center my-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="relative inline-flex items-center justify-center">
            <div className="w-28 h-28 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <Coffee size={56} className="text-primary animate-bounce" />
            </div>
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              Error 404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Table Not Found!
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto">
              Looks like this section of the cafe doesn&apos;t exist or was recently rearranged.
              Let&apos;s get you back to the right place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
                <Home size={18} />
                Return to Home
              </Button>
            </Link>
            <Link to="/demo" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white">
                <Compass size={18} className="text-primary" />
                Explore Demo Hub
              </Button>
            </Link>
            <Link to="/customer-demo" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-amber-200 text-amber-800 hover:bg-amber-50">
                <ShoppingBag size={18} className="text-amber-600" />
                View Customer Menu
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center py-4 border-t border-gray-200/60 text-xs text-gray-500 gap-2">
        <p>© 2026 CafeVibes — Restaurant POS & Digital Kitchen Management</p>
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/demo" className="hover:text-primary transition-colors">Demo Hub</Link>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
