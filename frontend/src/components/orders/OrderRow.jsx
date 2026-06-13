import React from 'react';

const OrderRow = ({ order, onViewDetails }) => {
  const { id, type, table, total, status, timestamp } = order;

  return (
    <tr className="order-row">
      <td>#{id}</td>
      <td>
        <span className={`order-type-badge ${type}`}>{type.toUpperCase()}</span>
      </td>
      <td>{table ? `Table ${table}` : 'N/A'}</td>
      <td>${total.toFixed(2)}</td>
      <td>
        <span className={`order-status-badge ${status}`}>{status.toUpperCase()}</span>
      </td>
      <td>{new Date(timestamp).toLocaleTimeString()}</td>
      <td>
        <button className="details-btn" onClick={() => onViewDetails(order)}>
          Details
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
