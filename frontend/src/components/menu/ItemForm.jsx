import React, { useState, useEffect } from 'react';

const ItemForm = ({ item, categories, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setPrice(item.price || '');
      setCost(item.cost || '');
      setCategory(item.category || '');
      setSku(item.sku || '');
      setStock(item.stock || '');
      setStatus(item.status || 'active');
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: item?.id,
      name,
      price: Number(price),
      cost: Number(cost),
      category,
      sku,
      stock: Number(stock),
      status
    });
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <div className="form-group">
        <label>Item Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Price ($)</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Cost ($)</label>
          <input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required />
        </div>
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>SKU</label>
          <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Stock Qty</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">{item ? 'Update Item' : 'Add Item'}</button>
      </div>
    </form>
  );
};

export default ItemForm;
