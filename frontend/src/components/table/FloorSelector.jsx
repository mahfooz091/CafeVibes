import React from 'react';

const FloorSelector = ({ floors, activeFloor, onSelectFloor }) => {
  return (
    <div className="floor-selector">
      {floors.map(floor => (
        <button
          key={floor.id}
          className={`floor-btn ${activeFloor === floor.id ? 'active' : ''}`}
          onClick={() => onSelectFloor(floor.id)}
        >
          {floor.name}
        </button>
      ))}
    </div>
  );
};

export default FloorSelector;
