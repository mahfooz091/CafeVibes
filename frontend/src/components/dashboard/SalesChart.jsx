import React from 'react';

const SalesChart = ({ data }) => {
  // Placeholder showing chart grid, sales trends values
  return (
    <div className="chart-container sales-chart">
      <h3>Sales Trend (Last 7 Days)</h3>
      <div className="chart-placeholder">
        {/* Simplified mock chart representation */}
        <div className="mock-chart-y-axis">
          <span>$1000</span>
          <span>$500</span>
          <span>$0</span>
        </div>
        <div className="mock-chart-bars">
          {data.map((item, index) => (
            <div key={index} className="mock-bar-wrapper">
              <div
                className="mock-bar"
                style={{ height: `${(item.amount / 1200) * 100}%` }}
              >
                <span className="mock-bar-tooltip">${item.amount}</span>
              </div>
              <span className="mock-bar-label">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
