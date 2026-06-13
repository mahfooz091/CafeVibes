import React, { useState } from 'react';
import OrderFilters from '../components/orders/OrderFilters';
import OrderRow from '../components/orders/OrderRow';
import ReceiptModal from '../components/orders/ReceiptModal';

const Orders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const mockOrders = [
    {
      id: '1001',
      type: 'dine-in',
      table: '2',
      subtotal: 42.13,
      tax: 3.37,
      discount: 0,
      total: 45.50,
      status: 'completed',
      timestamp: Date.now() - 3600000,
      items: [
        { name: 'Iced Latte', price: 5.00, quantity: 2 },
        { name: 'Choco Muffin', price: 4.00, quantity: 1 }
      ]
    },
    {
      id: '1002',
      type: 'takeaway',
      subtotal: 12.04,
      tax: 0.96,
      discount: 0,
      total: 13.00,
      status: 'pending',
      timestamp: Date.now() - 1800000,
      items: [
        { name: 'Cappuccino', price: 4.50, quantity: 1 }
      ]
    }
  ];

  const filteredOrders = mockOrders.filter(order => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dine-in') return order.type === 'dine-in';
    if (activeFilter === 'takeaway') return order.type === 'takeaway';
    if (activeFilter === 'delivery') return order.type === 'delivery';
    return order.status === activeFilter;
  });

  return (
    <div className="page-container orders-page">
      <OrderFilters
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Type</th>
              <th>Table</th>
              <th>Total</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <OrderRow
                key={order.id}
                order={order}
                onViewDetails={setSelectedOrder}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ReceiptModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
};

export default Orders;
