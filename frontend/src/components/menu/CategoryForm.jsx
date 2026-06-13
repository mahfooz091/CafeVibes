import React, { useState, useEffect } from 'react';

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setIcon(category.icon || '');
      setStatus(category.status || 'active');
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: category?.id,
      name,
      icon,
      status
    });
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <div className="form-group">
        <label>Category Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Icon / Emoji</label>
        <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="☕" required />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">{category ? 'Update Category' : 'Add Category'}</button>
      </div>
    </form>
  );
};

export default CategoryForm;
