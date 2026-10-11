import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Grid3X3, Users, ShoppingBag, BarChart3,
  Monitor, ChefHat, MapPin, Tag, LogOut, Menu, X, Coffee, Settings as SettingsIcon,
  UserCog,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const adminLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/categories', icon: Grid3X3, label: 'Categories' },
  { to: '/floors', icon: MapPin, label: 'Floors & Tables' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/users', icon: UserCog, label: 'Employees' },
  { to: '/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/coupons', icon: Tag, label: 'Coupons' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

const sharedLinks = [
  { to: '/pos', icon: Monitor, label: 'POS Terminal' },
  { to: '/kitchen', icon: ChefHat, label: 'Kitchen Display' },
];

const DashboardLayout = ({ children }) => {
  const { user, logout, isAdmin, isDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const canViewAll = isAdmin || isDemo;
  const links = canViewAll ? [...adminLinks, ...sharedLinks] : sharedLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden p-0.5 border border-gray-100/50">
            <img src="/logo.png" alt="Profile Logo" className="w-full h-full object-cover scale-[1.5] -translate-y-[10%]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs font-semibold capitalize text-primary">
              {isDemo ? (
                <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                  Demo Visitor
                </span>
              ) : (
                user?.role
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          {isDemo ? 'Exit Demo' : 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Persistent Read-Only Demo Notice Banner */}
      {isDemo && (
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white px-4 py-2 text-xs font-medium flex items-center justify-between shadow-sm z-50 border-b border-amber-900/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="bg-amber-950/80 text-amber-200 uppercase text-[10px] font-black px-2 py-0.5 rounded tracking-wider shadow-inner">
              DEMO MODE
            </span>
            <span className="hidden md:inline text-white/90">
              Read-only exploration session — All dashboards, menus, and reports are interactive. State changes and transactions are disabled.
            </span>
            <span className="md:hidden text-white/90">
              Read-only Demo — Changes disabled.
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 active:bg-white/40 text-white px-2.5 py-0.5 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
          >
            <LogOut size={12} /> Exit Demo
          </button>
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-shrink-0">
          <Sidebar />
        </aside>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-2xl"
              >
                <Sidebar />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <Logo size="sm" showText={false} />
            <div className="w-10" />
          </header>

          <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
