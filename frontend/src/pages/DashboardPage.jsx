import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-semibold text-coffee">
        Welcome back, {user?.name?.split(' ')[0]}
      </h1>
      <p className="mt-1 text-sm text-coffee/60">
        Here's what's happening across CafeVibes today.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Orders', value: '—' },
          { label: 'Revenue', value: '—' },
          { label: 'Avg Order Value', value: '—' },
        ].map((card) => (
          <div key={card.label} className="glass-card rounded-2xl border border-white/40 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-coffee/50">
              {card.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-teal">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-coffee/20 p-10 text-center text-sm text-coffee/50">
        Reports &amp; Analytics (Phase 12) will appear here — sales trends, top products, and
        category breakdowns.
      </div>
    </div>
  );
};

export default DashboardPage;
