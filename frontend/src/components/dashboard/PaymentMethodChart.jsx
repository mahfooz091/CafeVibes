import React from 'react';

const PaymentMethodChart = ({ data }) => {
  return (
    <div className="chart-container payment-chart">
      <h3>Payment Methods</h3>
      <div className="payment-chart-content">
        <div className="pie-placeholder">
          {/* Simple CSS-based representation of pie chart parts */}
          <div className="pie-circle"></div>
        </div>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color-dot" style={{ backgroundColor: item.color }}></span>
              <span className="legend-label">{item.method} ({item.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodChart;
