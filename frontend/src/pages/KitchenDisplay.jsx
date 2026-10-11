import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ChefHat, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { orderAPI } from '../services/endpoints';
import { connectSocket, disconnectSocket } from '../services/socket';
import { formatDateTime, getStatusColor } from '../utils/helpers';

const statusFlow = {
  to_cook: 'preparing',
  preparing: 'completed',
};

const statusLabels = {
  to_cook: 'Start Cooking',
  preparing: 'Mark Complete',
  completed: 'Done',
};

const KitchenDisplay = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['kitchen-orders', search, filter],
    queryFn: () => orderAPI.getKitchen({ search: search || undefined, status: filter || undefined }).then((r) => r.data.data),
    refetchInterval: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, itemId, kitchenStatus }) =>
      orderAPI.updateKitchen(orderId, { itemId, kitchenStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  useEffect(() => {
    const socket = connectSocket();

    socket.on('kitchen:new_order', () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
      toast('New order received!', { icon: '🔔' });
    });

    socket.on('kitchen:update', () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    });

    return () => disconnectSocket();
  }, [queryClient]);

  const handleItemStatus = (orderId, item) => {
    const nextStatus = statusFlow[item.kitchenStatus];
    if (nextStatus) {
      updateMutation.mutate({ orderId, itemId: item._id, kitchenStatus: nextStatus });
    }
  };

  const filters = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'To Cook' },
    { value: 'in_progress', label: 'Preparing' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ChefHat className="text-primary" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kitchen Display</h1>
              <p className="text-gray-500 text-sm">Real-time order tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === f.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? <LoadingSpinner className="h-64" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {orders?.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card !p-4 border-l-4"
                  style={{ borderLeftColor: order.kitchenStatus === 'in_progress' ? '#3B82F6' : '#F59E0B' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-primary">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <span className={`badge whitespace-nowrap ${getStatusColor(order.kitchenStatus)}`}>{order.kitchenStatus?.replace('_', ' ')}</span>
                  </div>

                  {order.table && <p className="text-xs text-gray-500 mb-2">Table: {order.table?.name}</p>}

                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">x{item.quantity}</p>
                        </div>
                        {item.kitchenStatus !== 'completed' ? (
                          <button
                            onClick={() => handleItemStatus(order._id, item)}
                            className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                              item.kitchenStatus === 'to_cook'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {statusLabels[item.kitchenStatus]}
                          </button>
                        ) : (
                          <CheckCircle size={16} className="text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!orders?.length && (
              <div className="col-span-full text-center py-16 text-gray-400">
                <ChefHat size={48} className="mx-auto mb-3 opacity-30" />
                <p>No active kitchen orders</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KitchenDisplay;
