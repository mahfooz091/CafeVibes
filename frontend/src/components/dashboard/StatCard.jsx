import React from 'react';

const StatCard = ({ title, value, icon, change, isPositive = true }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <h3 className="stat-card-value">{value}</h3>
        {change && (
          <span className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '▲' : '▼'} {change} since yesterday
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
