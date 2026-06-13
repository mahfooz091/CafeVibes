import React from 'react';
import TableCard from './TableCard';

const TableMap = ({ tables, onSelectTable }) => {
  return (
    <div className="table-map-grid">
      {tables.map(table => (
        <TableCard
          key={table.id}
          table={table}
          onClick={() => onSelectTable(table)}
        />
      ))}
    </div>
  );
};

export default TableMap;
