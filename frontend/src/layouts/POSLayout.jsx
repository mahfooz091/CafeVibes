import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  FiMenu,
  FiSearch,
  FiUser,
  FiGrid,
  FiClipboard,
  FiUsers,
  FiLayout,
  FiLogOut,
} from 'react-icons/fi';
import Logo from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';

const POSLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen flex-col bg-cream">
      <header className="flex items-center gap-4 border-b border-coffee/10 bg-white/70 px-4 py-3 backdrop-blur">
        <Logo showText={false} />

        <nav className="hidden items-center gap-1 md:flex">
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-teal hover:bg-teal/10">
            POS Order
          </button>
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-coffee/70 hover:bg-teal/10">
            Orders
          </button>
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-coffee/70 hover:bg-teal/10">
            Customer
          </button>
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-coffee/70 hover:bg-teal/10">
            Table View
          </button>
        </nav>

        <div className="relative ml-auto hidden flex-1 max-w-xs sm:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee/40" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border border-coffee/10 bg-cream px-9 py-2 text-sm focus:border-teal"
          />
        </div>

        <div className="ml-auto flex items-center gap-3 sm:ml-2">
          <div className="hidden items-center gap-2 rounded-lg bg-teal/10 px-3 py-1.5 text-sm font-medium text-teal sm:flex">
            <FiLayout />
            Table —
          </div>
          <div className="flex items-center gap-2 rounded-full bg-cream px-3 py-1.5">
            <FiUser className="text-coffee/60" />
            <span className="text-sm font-medium text-coffee">{user?.name}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-lg p-2 text-coffee/70 hover:bg-teal/10"
              aria-label="Open menu"
            >
              <FiMenu className="text-xl" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-coffee/10 bg-white p-2 shadow-glass">
                {[
                  { label: 'Products', icon: <FiGrid /> },
                  { label: 'Category', icon: <FiGrid /> },
                  { label: 'Payment Method', icon: <FiGrid /> },
                  { label: 'Coupon & Promotion', icon: <FiClipboard /> },
                  { label: 'Booking', icon: <FiClipboard /> },
                  { label: 'User/Employee', icon: <FiUsers /> },
                  { label: 'KDS', icon: <FiGrid /> },
                  { label: 'Reports', icon: <FiClipboard /> },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-coffee/80 hover:bg-teal/10 hover:text-teal"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div className="my-1 h-px bg-coffee/10" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <FiLogOut />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default POSLayout;
