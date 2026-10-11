import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { orderAPI, receiptAPI } from '../services/endpoints';
import { formatCurrency, formatDateTime, getStatusColor } from '../utils/helpers';

const Orders = () => {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', status, search],
    queryFn: () => orderAPI.getAll({ status: status || undefined, search: search || undefined }).then((r) => r.data.data),
  });

  const handleDownloadPDF = async (id, orderNumber) => {
    try {
      const { data } = await receiptAPI.downloadPDF(id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${orderNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm">View and manage all orders</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search by order number..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input-field sm:w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading ? <LoadingSpinner className="h-40" /> : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-3 font-medium">Order #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 font-medium text-primary">{order.orderNumber}</td>
                    <td className="py-3">{order.customer?.name || 'Walk-in'}</td>
                    <td className="py-3">{order.items?.length}</td>
                    <td className="py-3 font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3"><span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
                    <td className="py-3 text-gray-500">{formatDateTime(order.createdAt)}</td>
                    <td className="py-3">
                      {order.status === 'paid' && (
                        <button onClick={() => handleDownloadPDF(order._id, order.orderNumber)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Download Receipt">
                          <FileText size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!orders?.length && (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-400">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
