import React, { useState } from 'react';
import CategoryFilter from '../components/pos/CategoryFilter';
import MenuGrid from '../components/pos/MenuGrid';
import Cart from '../components/pos/Cart';
import PaymentModal from '../components/pos/PaymentModal';

const POS = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'tea', name: 'Tea' },
    { id: 'bakery', name: 'Bakery' }
  ];

  const menuItems = [
    { id: '1', name: 'Iced Latte', price: 5.00, category: 'coffee', image: '', status: 'active' },
    { id: '2', name: 'Cappuccino', price: 4.50, category: 'coffee', image: '', status: 'active' },
    { id: '3', name: 'Matcha Latte', price: 5.50, category: 'tea', image: '', status: 'active' },
    { id: '4', name: 'Butter Croissant', price: 3.50, category: 'bakery', image: '', status: 'active' },
    { id: '5', name: 'Choco Muffin', price: 4.00, category: 'bakery', image: '', status: 'out_of_stock' }
  ];

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToOrder = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleCompletePayment = (paymentDetails) => {
    alert(`Payment of $${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} completed successfully via ${paymentDetails.method}!`);
    setCartItems([]);
    setIsPaymentOpen(false);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.08; // 8%
  const total = subtotal * (1 + taxRate);

  return (
    <div className="page-container pos-page">
      <div className="pos-main">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <MenuGrid
          items={filteredItems}
          onAddToOrder={handleAddToOrder}
        />
      </div>
      <div className="pos-side">
        <Cart
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => setIsPaymentOpen(true)}
          taxRate={taxRate}
          discount={0}
        />
      </div>
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={total}
        onCompletePayment={handleCompletePayment}
      />
    </div>
  );
};

export default POS;
