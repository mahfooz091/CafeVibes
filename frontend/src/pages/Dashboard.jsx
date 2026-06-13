import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import PaymentMethodChart from '../components/dashboard/PaymentMethodChart';
import TopItemsList from '../components/dashboard/TopItemsList';

const Dashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: '$2,450.80', icon: '💰', change: '12%', isPositive: true },
    { title: 'Total Orders', value: '142', icon: '🛒', change: '8%', isPositive: true },
    { title: 'Average Order', value: '$17.25', icon: '📈', change: '3%', isPositive: true },
    { title: 'New Customers', value: '15', icon: '👤', change: '5%', isPositive: false }
  ];

  const salesData = [
    { day: 'Mon', amount: 800 },
    { day: 'Tue', amount: 950 },
    { day: 'Wed', amount: 1100 },
    { day: 'Thu', amount: 900 },
    { day: 'Fri', amount: 1200 },
    { day: 'Sat', amount: 1050 },
    { day: 'Sun', amount: 750 }
  ];

  const paymentData = [
    { method: 'Cash', percentage: 40, color: '#4caf50' },
    { method: 'Card', percentage: 45, color: '#2196f3' },
    { method: 'Mobile', percentage: 15, color: '#ff9800' }
  ];

  const topItems = [
    { name: 'Iced Latte', quantity: 54, revenue: 270.00 },
    { name: 'Cappuccino', quantity: 42, revenue: 189.00 },
    { name: 'Butter Croissant', quantity: 30, revenue: 105.00 },
    { name: 'Espresso', quantity: 28, revenue: 84.00 }
  ];

  return (
    <div className="page-container dashboard-page">
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
      <div className="charts-grid">
        <SalesChart data={salesData} />
        <PaymentMethodChart data={paymentData} />
      </div>
      <div className="dashboard-footer-grid">
        <TopItemsList items={topItems} />
      </div>
    </div>
  );
};

export default Dashboard;
