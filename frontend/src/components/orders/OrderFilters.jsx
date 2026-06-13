import React from 'react';

const OrderFilters = ({ activeFilter, onSelectFilter }) => {
  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'dine-in', label: 'Dine-In' },
    { id: 'takeaway', label: 'Takeaway' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div className="order-filters-bar">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onSelectFilter(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default OrderFilters;
