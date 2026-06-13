import React from 'react';
import MenuItemCard from './MenuItemCard';

const MenuGrid = ({ items, onAddToOrder }) => {
  return (
    <div className="menu-grid">
      {items.map(item => (
        <MenuItemCard
          key={item.id}
          item={item}
          onAdd={() => onAddToOrder(item)}
        />
      ))}
    </div>
  );
};

export default MenuGrid;
