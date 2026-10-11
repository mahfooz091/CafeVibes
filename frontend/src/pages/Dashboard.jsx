import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reportAPI } from '../services/endpoints';
import { formatCurrency } from '../utils/helpers';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => reportAPI.getDashboard().then((r) => r.data.data),
  });

  const { data: trend } = useQuery({
    queryKey: ['sales-trend'],
    queryFn: () => reportAPI.getSalesTrend({ days: 7 }).then((r) => r.data.data),
  });

  const { data: topProducts } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => reportAPI.getTopProducts({ limit: 5 }).then((r) => r.data.data),
  });

  if (statsLoading) return <DashboardLayout><LoadingSpinner className="h-64" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of your cafe performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats?.revenue)} color="bg-primary/10 text-primary" delay={0} />
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} color="bg-gold/20 text-coffee" delay={0.1} />
          <StatCard icon={TrendingUp} label="Avg Order Value" value={formatCurrency(stats?.avgOrderValue)} color="bg-blue-50 text-blue-600" delay={0.2} />
          <StatCard icon={Calendar} label="Today's Revenue" value={formatCurrency(stats?.todayRevenue)} color="bg-green-50 text-green-600" delay={0.3} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Sales Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(d) => d?.slice(5)} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#0F766E" fill="#0F766E" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Top Products</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#D4A373" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
