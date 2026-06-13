import React, { useState } from 'react';
import ItemForm from '../components/menu/ItemForm';
import CategoryForm from '../components/menu/CategoryForm';
import Modal from '../components/common/Modal';

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const categories = [
    { id: 'cat1', name: 'Coffee', icon: '☕', status: 'active' },
    { id: 'cat2', name: 'Tea', icon: '🍵', status: 'active' }
  ];

  const items = [
    { id: '1', name: 'Iced Latte', price: 5.00, cost: 1.20, category: 'cat1', sku: 'LATT-01', stock: 100, status: 'active' },
    { id: '2', name: 'Matcha Latte', price: 5.50, cost: 1.50, category: 'cat2', sku: 'MATC-02', stock: 50, status: 'active' }
  ];

  const handleSaveItem = (itemData) => {
    alert(`Saved item: ${itemData.name}`);
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveCategory = (categoryData) => {
    alert(`Saved category: ${categoryData.name}`);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="page-container menu-management-page">
      <div className="menu-mgmt-tabs">
        <button className={activeTab === 'items' ? 'active' : ''} onClick={() => setActiveTab('items')}>Items</button>
        <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>Categories</button>
      </div>

      <div className="tab-actions">
        {activeTab === 'items' ? (
          <button className="add-btn" onClick={() => { setEditingItem(null); setIsItemModalOpen(true); }}>Add New Item</button>
        ) : (
          <button className="add-btn" onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}>Add New Category</button>
        )}
      </div>

      {activeTab === 'items' ? (
        <div className="management-table-wrapper">
          <table className="management-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${item.cost.toFixed(2)}</td>
                  <td>{item.stock}</td>
                  <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
                  <td>
                    <button className="edit-btn" onClick={() => { setEditingItem(item); setIsItemModalOpen(true); }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="management-table-wrapper">
          <table className="management-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.icon}</td>
                  <td>{cat.name}</td>
                  <td><span className={`status-badge ${cat.status}`}>{cat.status}</span></td>
                  <td>
                    <button className="edit-btn" onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}>
        <ItemForm
          item={editingItem}
          categories={categories}
          onSubmit={handleSaveItem}
          onCancel={() => setIsItemModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSaveCategory}
          onCancel={() => setIsCategoryModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default MenuManagement;
