import React, { useState } from 'react';
import FloorSelector from '../components/table/FloorSelector';
import TableMap from '../components/table/TableMap';

const TableManagement = () => {
  const [activeFloor, setActiveFloor] = useState('ground');

  const floors = [
    { id: 'ground', name: 'Ground Floor' },
    { id: 'terrace', name: 'Terrace' }
  ];

  const tables = [
    { id: 't1', name: 'Table 1', seats: 2, status: 'available', floor: 'ground' },
    { id: 't2', name: 'Table 2', seats: 4, status: 'occupied', orderTotal: 45.50, floor: 'ground' },
    { id: 't3', name: 'Table 3', seats: 2, status: 'billed', orderTotal: 22.00, floor: 'ground' },
    { id: 't4', name: 'Table 4', seats: 6, status: 'reserved', floor: 'ground' },
    { id: 't5', name: 'Table 5', seats: 4, status: 'available', floor: 'terrace' },
    { id: 't6', name: 'Table 6', seats: 2, status: 'occupied', orderTotal: 18.50, floor: 'terrace' }
  ];

  const filteredTables = tables.filter(t => t.floor === activeFloor);

  const handleSelectTable = (table) => {
    alert(`Selected Table: ${table.name}. Status: ${table.status}. Current Total: $${table.orderTotal || 0}`);
  };

  return (
    <div className="page-container table-management-page">
      <div className="table-mgmt-header">
        <FloorSelector
          floors={floors}
          activeFloor={activeFloor}
          onSelectFloor={setActiveFloor}
        />
        <div className="table-status-legend">
          <span className="legend-item"><span className="legend-dot available"></span> Available</span>
          <span className="legend-item"><span className="legend-dot occupied"></span> Occupied</span>
          <span className="legend-item"><span className="legend-dot billed"></span> Billed</span>
          <span className="legend-item"><span className="legend-dot reserved"></span> Reserved</span>
        </div>
      </div>
      <TableMap
        tables={filteredTables}
        onSelectTable={handleSelectTable}
      />
    </div>
  );
};

export default TableManagement;
