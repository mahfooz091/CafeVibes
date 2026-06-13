import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiCoffee,
  FiTag,
  FiUsers,
  FiClipboard,
  FiBarChart2,
  FiLogOut,
} from 'react-icons/fi';
import Logo from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/products', label: 'Products', icon: <FiCoffee /> },
  { to: '/categories', label: 'Categories', icon: <FiTag /> },
  { to: '/customers', label: 'Customers', icon: <FiUsers /> },
  { to: '/orders', label: 'Orders', icon: <FiClipboard /> },
  { to: '/reports', label: 'Reports', icon: <FiBarChart2 /> },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-64 flex-col border-r border-coffee/10 bg-white/60 backdrop-blur lg:flex">
        <div className="px-6 py-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-teal text-white shadow-glass'
                    : 'text-coffee/70 hover:bg-teal/10 hover:text-teal'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-coffee/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-cream px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-coffee">{user?.name}</p>
              <p className="truncate text-xs text-coffee/50 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-coffee/70 transition hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut className="text-lg" />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
