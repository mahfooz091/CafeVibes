import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Users,
  Briefcase,
  Tag,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reportAPI, productAPI } from '../services/endpoints';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

// Dummy Fallback Datasets for Demo Mode & Resilient Rendering
const DUMMY_DEMO_STATS = {
  revenue: 142850,
  totalOrders: 284,
  avgOrderValue: 502.99,
  todayRevenue: 16840,
  todayOrders: 32,
};

const DUMMY_DEMO_TREND = [
  { date: '2026-10-05', revenue: 12400, orders: 24 },
  { date: '2026-10-06', revenue: 14100, orders: 27 },
  { date: '2026-10-07', revenue: 13850, orders: 26 },
  { date: '2026-10-08', revenue: 15600, orders: 29 },
  { date: '2026-10-09', revenue: 18900, orders: 36 },
  { date: '2026-10-10', revenue: 22400, orders: 42 },
  { date: '2026-10-11', revenue: 16840, orders: 32 },
];

const DUMMY_DEMO_TOP_PRODUCTS = [
  { productId: 'demo_p1', name: 'Ceremonial Matcha Latte', quantity: 42, revenue: 10080 },
  { productId: 'demo_p2', name: 'Vanilla Silk Cappuccino', quantity: 48, revenue: 8640 },
  { productId: 'demo_p3', name: 'Smoked Avocado Toast', quantity: 26, revenue: 7280 },
  { productId: 'demo_p4', name: 'Caramel Macchiato Reserve', quantity: 31, revenue: 6820 },
  { productId: 'demo_p5', name: 'Flaky Almond Butter Croissant', quantity: 38, revenue: 6080 },
  { productId: 'demo_p6', name: 'Kyoto Cold Brew', quantity: 29, revenue: 5800 },
  { productId: 'demo_p7', name: 'Truffle Mushroom Panini', quantity: 18, revenue: 5760 },
];

const DUMMY_DEMO_TOP_CATEGORIES = [
  { categoryId: 'demo_c1', name: 'Specialty Coffee', color: '#6F4E37', quantity: 124, revenue: 24200 },
  { categoryId: 'demo_c2', name: 'Artisanal Teas', color: '#0F766E', quantity: 68, revenue: 14640 },
  { categoryId: 'demo_c3', name: 'Gourmet Sandwiches', color: '#14B8A6', quantity: 44, revenue: 13040 },
  { categoryId: 'demo_c4', name: 'Bakery & Pastries', color: '#D4A373', quantity: 64, revenue: 10240 },
  { categoryId: 'demo_c5', name: 'Desserts & Sweets', color: '#B45309', quantity: 35, revenue: 9100 },
];

const DUMMY_DEMO_TOP_ORDERS = [
  {
    _id: 'demo_o1',
    orderNumber: 'ORD-DEMO-104',
    customer: { name: 'Morgan Chen' },
    payment: { method: 'card' },
    total: 1617,
  },
  {
    _id: 'demo_o2',
    orderNumber: 'ORD-DEMO-101',
    customer: { name: 'Alex Rivera' },
    payment: { method: 'upi' },
    total: 714,
  },
  {
    _id: 'demo_o3',
    orderNumber: 'ORD-DEMO-103',
    customer: { name: 'Taylor Brooks' },
    payment: { method: 'cash' },
    total: 664,
  },
  {
    _id: 'demo_o4',
    orderNumber: 'ORD-DEMO-102',
    customer: { name: 'Jordan Lee' },
    payment: { method: 'card' },
    total: 567,
  },
];

const DUMMY_DEMO_EMPLOYEES = [
  { _id: 'demo_u1', name: 'Rahul Sharma', role: 'manager' },
  { _id: 'demo_u2', name: 'Priya Verma', role: 'cashier' },
  { _id: 'demo_u3', name: 'Vikas Kumar', role: 'barista' },
];

const DUMMY_DEMO_SESSIONS = [
  {
    _id: 'demo_s1',
    user: { name: 'Demo Administrator' },
    openedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    status: 'open',
  },
  {
    _id: 'demo_s2',
    user: { name: 'Demo Head Barista' },
    openedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    status: 'closed',
  },
];

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculatePeriodRange = (period) => {
  const today = new Date();
  if (period === 'today') {
    const dateStr = getLocalDateString(today);
    return { startDate: dateStr, endDate: dateStr };
  }
  if (period === 'week') {
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    return { startDate: getLocalDateString(start), endDate: getLocalDateString(today) };
  }
  if (period === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate: getLocalDateString(start), endDate: getLocalDateString(today) };
  }
  return { startDate: '', endDate: '' };
};

const Reports = () => {
  const { user, isDemo } = useAuth();
  const isDemoViewer = Boolean(isDemo || user?.role === 'demo_viewer');

  const [period, setPeriod] = useState('all');
  const [employee, setEmployee] = useState('');
  const [session, setSession] = useState('');
  const [product, setProduct] = useState('');
  const [customRange, setCustomRange] = useState({ startDate: '', endDate: '' });
  const [trendMetric, setTrendMetric] = useState('revenue');

  // Filter sources
  const { data: employees } = useQuery({
    queryKey: ['report-employees'],
    queryFn: () => reportAPI.getEmployees().then((r) => r.data.data),
  });

  const { data: sessions } = useQuery({
    queryKey: ['report-sessions'],
    queryFn: () => reportAPI.getSessions().then((r) => r.data.data),
  });

  const { data: productsList } = useQuery({
    queryKey: ['report-products-list'],
    queryFn: () => productAPI.getAll({ isActive: true }).then((r) => r.data.data),
  });

  // Calculate parameters to pass to queries
  const getParams = () => {
    let dates = { startDate: '', endDate: '' };
    if (period === 'custom') {
      dates = customRange;
    } else {
      dates = calculatePeriodRange(period);
    }
    return {
      startDate: dates.startDate || undefined,
      endDate: dates.endDate || undefined,
      employee: employee || undefined,
      session: session || undefined,
      product: product || undefined,
    };
  };

  const params = getParams();

  // Primary report queries
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['report-dashboard', params],
    queryFn: () => reportAPI.getDashboard(params).then((r) => r.data.data),
  });

  const { data: trend, isLoading: trendLoading } = useQuery({
    queryKey: ['sales-trend', params],
    queryFn: () => reportAPI.getSalesTrend(params).then((r) => r.data.data),
  });

  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['top-products', params],
    queryFn: () => reportAPI.getTopProducts(params).then((r) => r.data.data),
  });

  const { data: topCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['top-categories', params],
    queryFn: () => reportAPI.getTopCategories(params).then((r) => r.data.data),
  });

  const { data: topOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['top-orders', params],
    queryFn: () => reportAPI.getTopOrders({ ...params, limit: 10 }).then((r) => r.data.data),
  });

  // Resilient data extractors ensuring no crashes occur
  const safeArray = (val, fallback = []) => (Array.isArray(val) ? val : fallback);

  const effectiveEmployees = safeArray(employees, isDemoViewer ? DUMMY_DEMO_EMPLOYEES : []);
  const effectiveSessions = safeArray(sessions, isDemoViewer ? DUMMY_DEMO_SESSIONS : []);
  const effectiveProductsList = safeArray(productsList, []);

  const effectiveStats =
    stats && typeof stats === 'object' && !Array.isArray(stats) && (stats.revenue !== undefined || stats.totalOrders !== undefined)
      ? stats
      : isDemoViewer
      ? DUMMY_DEMO_STATS
      : { revenue: 0, totalOrders: 0, avgOrderValue: 0 };

  const effectiveTrend = safeArray(trend, isDemoViewer ? DUMMY_DEMO_TREND : []);
  const effectiveTopProducts = safeArray(topProducts, isDemoViewer ? DUMMY_DEMO_TOP_PRODUCTS : []);
  const effectiveTopCategories = safeArray(topCategories, isDemoViewer ? DUMMY_DEMO_TOP_CATEGORIES : []);
  const effectiveTopOrders = safeArray(topOrders, isDemoViewer ? DUMMY_DEMO_TOP_ORDERS : []);

  const handleResetFilters = () => {
    setPeriod('month');
    setEmployee('');
    setSession('');
    setProduct('');
    setCustomRange({ startDate: '', endDate: '' });
  };

  const handleExport = async (type) => {
    try {
      const api = type === 'excel' ? reportAPI.exportExcel : reportAPI.exportPDF;
      const { data } = await api(params);
      const ext = type === 'excel' ? 'xlsx' : 'pdf';
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `cafevibes-report.${ext}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch {
      toast.error('Export failed');
    }
  };

  const COLORS = ['#0F766E', '#D4A373', '#6F4E37', '#14B8A6', '#F59E0B'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-500 text-sm">Real-time business insights and exports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleExport('excel')} className="shrink-0">
              <FileSpreadsheet size={16} /> Excel
            </Button>
            <Button variant="secondary" onClick={() => handleExport('pdf')} className="shrink-0">
              <Download size={16} /> PDF
            </Button>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        {isDemoViewer && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-xl p-4 flex items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-amber-900">Admin Demo Report:</span>{' '}
                <span className="text-amber-800">
                  Displaying simulated cafe business metrics, sales trajectories, and order trends. Filter and export dummy data freely — changes do not affect live systems.
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold shrink-0">
              <ShieldCheck size={12} /> Read-Only Demo
            </span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="card !p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Period Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={13} /> Period
              </label>
              <select
                className="input-field !py-2 text-sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            {/* Employee Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Users size={13} /> Employee
              </label>
              <select
                className="input-field !py-2 text-sm"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                <option value="">All Employees</option>
                {effectiveEmployees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Session Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Briefcase size={13} /> POS Session
              </label>
              <select
                className="input-field !py-2 text-sm"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                <option value="">All Sessions</option>
                {effectiveSessions.map((sess) => (
                  <option key={sess._id} value={sess._id}>
                    {sess.user?.name || 'Staff'} - {sess.openedAt ? formatDateTime(sess.openedAt).split(',')[0] : 'Today'} ({sess.status || 'open'})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Tag size={13} /> Product
              </label>
              <select
                className="input-field !py-2 text-sm"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option value="">All Products</option>
                {effectiveProductsList.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Date Range Picker */}
          {period === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">From:</span>
                <input
                  type="date"
                  className="input-field !py-1.5 !px-3 text-xs w-auto"
                  value={customRange.startDate}
                  onChange={(e) => setCustomRange({ ...customRange, startDate: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">To:</span>
                <input
                  type="date"
                  className="input-field !py-1.5 !px-3 text-xs w-auto"
                  value={customRange.endDate}
                  onChange={(e) => setCustomRange({ ...customRange, endDate: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Reset Filters CTA */}
          {(employee || session || product || period !== 'all' || customRange.startDate || customRange.endDate) && (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={12} /> Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Loading / KPI Metrics & Charts */}
        {statsLoading && !isDemoViewer ? (
          <LoadingSpinner className="h-64" />
        ) : (
          <>
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card flex items-center gap-4 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <DollarSign size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(effectiveStats.revenue || 0)}</p>
                </div>
              </div>
              <div className="card flex items-center gap-4 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{effectiveStats.totalOrders || 0}</p>
                </div>
              </div>
              <div className="card flex items-center gap-4 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gold/20 text-coffee">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Average Order Value</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(effectiveStats.avgOrderValue || 0)}</p>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sales Trend Chart */}
              <div className="card flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Sales Trend</h3>
                  <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs font-semibold">
                    <button
                      onClick={() => setTrendMetric('revenue')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        trendMetric === 'revenue' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Revenue
                    </button>
                    <button
                      onClick={() => setTrendMetric('orders')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        trendMetric === 'orders' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Orders
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-h-[280px]">
                  {trendLoading && !isDemoViewer ? (
                    <LoadingSpinner className="h-64" />
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={effectiveTrend}>
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: '#6b7280' }}
                          tickFormatter={(d) => (typeof d === 'string' && d.length >= 5 ? d.slice(5) : d || '')}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: '#6b7280' }}
                          tickFormatter={(v) => {
                            const num = Number(v) || 0;
                            return trendMetric === 'revenue' ? (num >= 1000 ? `₹${(num / 1000).toFixed(0)}k` : `₹${num}`) : num;
                          }}
                        />
                        <Tooltip formatter={(v) => (trendMetric === 'revenue' ? formatCurrency(v) : v)} />
                        <Area type="monotone" dataKey={trendMetric} stroke="#0F766E" fill="url(#trendGradient)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Top Categories Chart */}
              <div className="card flex flex-col">
                <h3 className="font-semibold text-gray-800 mb-4">Category Distribution</h3>
                <div className="flex-1 min-h-[280px]">
                  {categoriesLoading && !isDemoViewer ? (
                    <LoadingSpinner className="h-64" />
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={effectiveTopCategories}
                          dataKey="revenue"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={2}
                          label={({ name, percent }) => `${name || 'Item'} (${((percent || 0) * 100).toFixed(0)}%)`}
                        >
                          {effectiveTopCategories.map((entry, i) => (
                            <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => formatCurrency(v)} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Top Products Table */}
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Top Products</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-medium pb-2 text-xs uppercase">
                        <th className="py-2">Product</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsLoading && !isDemoViewer ? (
                        <tr>
                          <td colSpan="3">
                            <LoadingSpinner className="py-4" />
                          </td>
                        </tr>
                      ) : effectiveTopProducts.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-400">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        effectiveTopProducts.map((p) => (
                          <tr key={p.productId || p.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-2.5 font-medium text-gray-800 max-w-[150px] truncate">{p.name}</td>
                            <td className="py-2.5 text-center text-gray-600">{p.quantity}</td>
                            <td className="py-2.5 text-right font-semibold text-primary">{formatCurrency(p.revenue)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Categories Table */}
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Top Categories</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-medium pb-2 text-xs uppercase">
                        <th className="py-2">Category</th>
                        <th className="py-2 text-center">Items Sold</th>
                        <th className="py-2 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesLoading && !isDemoViewer ? (
                        <tr>
                          <td colSpan="3">
                            <LoadingSpinner className="py-4" />
                          </td>
                        </tr>
                      ) : effectiveTopCategories.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-400">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        effectiveTopCategories.map((c) => (
                          <tr key={c.categoryId || c.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-2.5 font-medium text-gray-800 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color || '#0F766E' }} />
                              <span>{c.name || 'Uncategorized'}</span>
                            </td>
                            <td className="py-2.5 text-center text-gray-600">{c.quantity || 0}</td>
                            <td className="py-2.5 text-right font-semibold text-primary">{formatCurrency(c.revenue)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Orders Table */}
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Top Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-medium pb-2 text-xs uppercase">
                        <th className="py-2">Order</th>
                        <th className="py-2">Method</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersLoading && !isDemoViewer ? (
                        <tr>
                          <td colSpan="3">
                            <LoadingSpinner className="py-4" />
                          </td>
                        </tr>
                      ) : effectiveTopOrders.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-400">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        effectiveTopOrders.map((o) => (
                          <tr key={o._id || o.orderNumber} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-2.5 font-medium text-gray-800">
                              <div className="font-semibold">{o.orderNumber}</div>
                              <div className="text-xs text-gray-400">{o.customer?.name || 'Walk-in'}</div>
                            </td>
                            <td className="py-2.5 text-gray-600 uppercase text-xs">{o.payment?.method || 'N/A'}</td>
                            <td className="py-2.5 text-right font-bold text-primary">{formatCurrency(o.total)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
