import React from 'react';

const TableCard = ({ table, onClick }) => {
  const { name, status, seats, orderTotal } = table;

  const getStatusClass = () => {
    switch (status) {
      case 'occupied': return 'table-occupied';
      case 'billed': return 'table-billed';
      case 'reserved': return 'table-reserved';
      default: return 'table-available';
    }
  };

  return (
    <div className={`table-card ${getStatusClass()}`} onClick={onClick}>
      <div className="table-card-header">
        <h4>{name}</h4>
        <span className="seats-badge">{seats} Seats</span>
      </div>
      <div className="table-card-body">
        {status === 'occupied' && (
          <div className="order-indicator">
            <span>Occupied</span>
            <strong>${orderTotal?.toFixed(2)}</strong>
          </div>
        )}
        {status === 'billed' && (
          <div className="order-indicator billed">
            <span>Billed</span>
            <strong>${orderTotal?.toFixed(2)}</strong>
          </div>
        )}
        {status === 'reserved' && <span className="reserved-indicator">Reserved</span>}
        {status === 'available' && <span className="available-indicator">Available</span>}
      </div>
    </div>
  );
};

export default TableCard;
