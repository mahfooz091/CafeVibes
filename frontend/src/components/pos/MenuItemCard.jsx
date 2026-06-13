import React from 'react';

const MenuItemCard = ({ item, onAdd }) => {
  const { name, price, image, status } = item;
  const isOutOfStock = status === 'out_of_stock';

  return (
    <div className={`menu-item-card ${isOutOfStock ? 'disabled' : ''}`} onClick={!isOutOfStock ? onAdd : undefined}>
      {image && <img src={image} alt={name} className="menu-item-image" />}
      <div className="menu-item-info">
        <h4 className="menu-item-name">{name}</h4>
        <span className="menu-item-price">${price.toFixed(2)}</span>
      </div>
      {isOutOfStock && <span className="sold-out-badge">Sold Out</span>}
    </div>
  );
};

export default MenuItemCard;
