import React from 'react';

const TopItemsList = ({ items }) => {
  return (
    <div className="top-items-container">
      <h3>Top Selling Items</h3>
      <ul className="top-items-list">
        {items.map((item, index) => (
          <li key={index} className="top-item-row">
            <span className="top-item-rank">#{index + 1}</span>
            <span className="top-item-name">{item.name}</span>
            <span className="top-item-qty">{item.quantity} sold</span>
            <span className="top-item-revenue">${item.revenue.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopItemsList;
