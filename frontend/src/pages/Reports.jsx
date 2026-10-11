import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileSpreadsheet, Calendar, Users, Briefcase, Tag, RefreshCw, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reportAPI, productAPI } from '../services/endpoints';
import { formatCurrency, formatDateTime } from '../utils/helpers';

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
                {employees?.map((emp) => (
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
                {sessions?.map((sess) => (
                  <option key={sess._id} value={sess._id}>
                    {sess.user?.name} - {formatDateTime(sess.openedAt).split(',')[0]} ({sess.status})
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
                {productsList?.map((prod) => (
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
          {(employee || session || product || period !== 'month' || customRange.startDate || customRange.endDate) && (
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
        {statsLoading ? (
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
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats?.revenue || 0)}</p>
                </div>
              </div>
              <div className="card flex items-center gap-4 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
                </div>
              </div>
              <div className="card flex items-center gap-4 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gold/20 text-coffee">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Average Order Value</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats?.avgOrderValue || 0)}</p>
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
                  {trendLoading ? (
                    <LoadingSpinner className="h-64" />
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={trend || []}>
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(d) => d?.slice(5)} />
                        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => trendMetric === 'revenue' ? (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`) : v} />
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
                  {categoriesLoading ? (
                    <LoadingSpinner className="h-64" />
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={topCategories || []}
                          dataKey="revenue"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={2}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {(topCategories || []).map((entry, i) => (
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
                      {productsLoading ? (
                        <tr>
                          <td colSpan="3">
                            <LoadingSpinner className="py-4" />
                          </td>
                        </tr>
                      ) : topProducts?.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-400">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        topProducts?.map((p) => (
                          <tr key={p.productId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
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
                      {categoriesLoading ? (
                        <tr>
                          <td colSpan="3">
                            <LoadingSpinner className="py-4" />
                          </td>
                        </tr>
                      ) : topCategories?.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-400">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        topCategories?.map((c) => (
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
                      {ordersLoading ? (
                        <tr>
                          <td colSpan="3">
                            <LoadingSpinner className="py-4" />
                          </td>
                        </tr>
                      ) : topOrders?.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-400">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        topOrders?.map((o) => (
                          <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
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
