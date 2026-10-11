import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, Plus, Minus, Trash2, X, CheckCircle2,
  Clock, ArrowRight, ShieldAlert, Sparkles, MapPin, Coffee, Utensils,
  ChevronRight, ArrowLeft, RefreshCw, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';

// Rich synthetic customer menu dataset
const initialCategories = [
  { id: 'all', name: 'All Items' },
  { id: 'coffee', name: 'Specialty Coffee', icon: '☕' },
  { id: 'tea', name: 'Artisanal Teas', icon: '🍵' },
  { id: 'bakery', name: 'Bakery & Pastries', icon: '🥐' },
  { id: 'sandwich', name: 'Gourmet Sandwiches', icon: '🥪' },
  { id: 'dessert', name: 'Desserts & Sweets', icon: '🍰' },
];

const customerMenu = [
  {
    id: 'prod-1',
    name: 'Espresso Romano',
    category: 'coffee',
    price: 120,
    emoji: '☕',
    badge: 'Classic',
    description: 'Double shot handcrafted espresso infused with fresh lemon twist',
    calories: '5 kcal',
  },
  {
    id: 'prod-2',
    name: 'Vanilla Silk Cappuccino',
    category: 'coffee',
    price: 180,
    emoji: '☕',
    badge: 'Bestseller',
    description: 'Espresso layered with steamed whole milk and velvety microfoam',
    calories: '140 kcal',
  },
  {
    id: 'prod-3',
    name: 'Caramel Macchiato Reserve',
    category: 'coffee',
    price: 220,
    emoji: '☕',
    badge: 'Popular',
    description: 'Freshly steamed milk with vanilla, marked with espresso and artisanal caramel',
    calories: '210 kcal',
  },
  {
    id: 'prod-4',
    name: 'Hazelnut Cold Brew',
    category: 'coffee',
    price: 200,
    emoji: '🧊',
    badge: 'Chilled',
    description: 'Slow-steeped 16-hour cold brew infused with roasted hazelnut essence',
    calories: '90 kcal',
  },
  {
    id: 'prod-5',
    name: 'Ceremonial Matcha Latte',
    category: 'tea',
    price: 240,
    emoji: '🍵',
    badge: 'Organic',
    description: 'First-harvest Uji matcha whisked with oat milk and organic blossom honey',
    calories: '120 kcal',
  },
  {
    id: 'prod-6',
    name: 'Royal Masala Chai Blend',
    category: 'tea',
    price: 110,
    emoji: '🫖',
    badge: 'Signature',
    description: 'Assam black tea slow-brewed with fresh ginger, cardamom, cinnamon, and whole milk',
    calories: '110 kcal',
  },
  {
    id: 'prod-7',
    name: 'Flaky Almond Butter Croissant',
    category: 'bakery',
    price: 160,
    emoji: '🥐',
    badge: 'Fresh Baked',
    description: 'Butter laminated pastry filled with sweet almond frangipane and toasted slices',
    calories: '280 kcal',
  },
  {
    id: 'prod-8',
    name: 'Dark Chocolate Fudge Muffin',
    category: 'bakery',
    price: 140,
    emoji: '🧁',
    badge: 'Decadent',
    description: 'Belgian cocoa muffin stuffed with molten chocolate ganache center',
    calories: '310 kcal',
  },
  {
    id: 'prod-9',
    name: 'Smoked Avocado Toast',
    category: 'sandwich',
    price: 280,
    emoji: '🥑',
    badge: 'Chef Special',
    description: 'Crushed Hass avocado on artisanal sourdough, microgreens, and chili flakes',
    calories: '260 kcal',
  },
  {
    id: 'prod-10',
    name: 'Truffle Mushroom Panini',
    category: 'sandwich',
    price: 320,
    emoji: '🥪',
    badge: 'Gourmet',
    description: 'Wild forest mushrooms, melted provolone cheese, and white truffle oil on focaccia',
    calories: '340 kcal',
  },
  {
    id: 'prod-11',
    name: 'Tiramisu Classico Jar',
    category: 'dessert',
    price: 260,
    emoji: '🍰',
    badge: 'House Made',
    description: 'Espresso-soaked Savoiardi ladyfingers layered with rich mascarpone zabaglione',
    calories: '290 kcal',
  },
  {
    id: 'prod-12',
    name: 'New York Baked Cheesecake',
    category: 'dessert',
    price: 270,
    emoji: '🧀',
    badge: 'Rich & Creamy',
    description: 'Traditional slow-baked vanilla cream cheese slice with wild raspberry coulis',
    calories: '330 kcal',
  },
];

const CustomerDemo = () => {
  const { logout, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Local interactive demo state (isolated to browser session)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in', 'takeaway', 'delivery'
  const [tableNumber, setTableNumber] = useState('Table 4 (Garden)');
  const [cart, setCart] = useState([
    { ...customerMenu[1], quantity: 1, customization: { milk: 'Whole Milk', sugar: 'Regular' } },
    { ...customerMenu[6], quantity: 1, customization: { milk: 'Standard', sugar: 'Standard' } },
  ]);
  const [cartOpen, setCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customization, setCustomization] = useState({
    milk: 'Whole Milk',
    sugar: 'Regular',
    temperature: 'Hot',
  });

  // Simulated Checkout & Order Tracking State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Demo Guest');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Filtered menu
  const filteredProducts = useMemo(() => {
    return customerMenu.filter((prod) => {
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart operations (purely local, 0 database writes)
  const addToCart = (product, custom = null) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          customization: custom || { milk: 'Whole Milk', sugar: 'Regular' },
        },
      ];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponApplied ? 50 : 0;
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount + tax);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'COFFEEVIBES' || couponCode.trim().toUpperCase() === 'DEMO') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon. Try code "COFFEEVIBES" for ₹50 off!');
    }
  };

  const handleSimulatedCheckout = () => {
    const syntheticOrderNumber = `CV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      orderId: syntheticOrderNumber,
      items: [...cart],
      total,
      orderType,
      tableNumber,
      customerName,
      paymentMethod,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'preparing',
    };
    setCompletedOrder(newOrder);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  const handleSwitchToAdmin = async () => {
    await demoLogin('admin');
    navigate('/dashboard');
  };

  const handleExitDemo = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* 1. Top Customer Demo Notice Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white px-4 py-2 text-xs font-medium flex items-center justify-between shadow-sm z-40 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="bg-amber-950/90 text-amber-200 uppercase text-[10px] font-black px-2 py-0.5 rounded tracking-wider shadow-inner">
            CUSTOMER DEMO
          </span>
          <span className="hidden md:inline text-white/90">
            Guest ordering simulation — Browse menu, add to cart, and test checkout. No payments charged, zero database changes.
          </span>
          <span className="md:hidden text-white/90">
            Guest Demo — Simulated orders only.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSwitchToAdmin}
            className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-0.5 rounded text-xs font-semibold cursor-pointer transition-colors hidden sm:flex items-center gap-1 shadow-sm"
          >
            <Sparkles size={12} className="text-amber-300" /> Switch to Admin Demo
          </button>
          <button
            onClick={handleExitDemo}
            className="bg-red-500/80 hover:bg-red-600 text-white px-2.5 py-0.5 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
          >
            Exit Demo
          </button>
        </div>
      </div>

      {/* 2. Customer Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            {/* Fulfillment Type Selector */}
            <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-600">
              <button
                onClick={() => setOrderType('dine-in')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  orderType === 'dine-in' ? 'bg-white text-primary shadow-xs font-bold' : 'hover:text-gray-900'
                }`}
              >
                Dine-In
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  orderType === 'takeaway' ? 'bg-white text-primary shadow-xs font-bold' : 'hover:text-gray-900'
                }`}
              >
                Takeaway
              </button>
              <button
                onClick={() => setOrderType('delivery')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  orderType === 'delivery' ? 'bg-white text-primary shadow-xs font-bold' : 'hover:text-gray-900'
                }`}
              >
                Delivery
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {orderType === 'dine-in' && (
              <div className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900">
                <MapPin size={14} className="text-amber-700" />
                <span>{tableNumber}</span>
              </div>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-primary hover:bg-primary-600 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">My Tray</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-gray-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              {subtotal > 0 && (
                <span className="hidden sm:inline border-l border-white/30 pl-2">
                  ₹{subtotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Customer Ordering Catalog */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex-1 space-y-6">
        {/* Search & Hero Greeting */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-cream via-amber-50 to-primary/5 p-6 rounded-3xl border border-amber-200/40">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
              Artisanal Coffee & Kitchen Menu
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900">
              Fresh Brews & Handcrafted Bites
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Select your favorites, customize milk and roast levels, and place your simulated guest order.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coffee, tea, pastry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {initialCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/70'
                }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const inCart = cart.find((item) => item.id === product.id);
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-gray-150 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Product Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-cream border border-gold/20 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                      {product.emoji}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                      {product.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span>{product.calories}</span>
                    <span>•</span>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                      }}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Customize item
                    </button>
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400">Price</span>
                    <p className="text-lg font-black text-gray-900">₹{product.price}</p>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-2 bg-primary/10 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white text-primary flex items-center justify-center font-bold shadow-xs hover:bg-primary hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm text-primary px-1">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white text-primary flex items-center justify-center font-bold shadow-xs hover:bg-primary hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 bg-primary hover:bg-primary-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <Plus size={14} /> Add to Tray
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-200/60 p-8">
            <Coffee size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700">No menu items found</p>
            <p className="text-xs text-gray-400 mt-1">Try searching for a different item or category.</p>
          </div>
        )}
      </main>

      {/* 4. Customization Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-cream">{selectedProduct.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-primary font-black text-sm">₹{selectedProduct.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Milk Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Milk Preference
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Whole Milk', 'Oat Milk (+₹30)', 'Almond Milk (+₹30)'].map((milk) => (
                    <button
                      key={milk}
                      onClick={() => setCustomization({ ...customization, milk })}
                      className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                        customization.milk === milk
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {milk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sugar Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Sweetness
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Unsweetened', 'Less Sweet', 'Regular'].map((sugar) => (
                    <button
                      key={sugar}
                      onClick={() => setCustomization({ ...customization, sugar })}
                      className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                        customization.sugar === sugar
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {sugar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Temperature
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Hot (Steamed)', 'Iced (Over Cubes)'].map((temp) => (
                    <button
                      key={temp}
                      onClick={() => setCustomization({ ...customization, temperature: temp })}
                      className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                        customization.temperature === temp
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  addToCart(selectedProduct, customization);
                  setSelectedProduct(null);
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Customized Item
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Sliding Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              <div className="p-5 border-b border-gray-150 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  <h2 className="font-bold text-lg text-gray-900">Your Tray ({cartCount})</h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag size={48} className="text-gray-300 mx-auto" />
                    <p className="font-bold text-gray-700">Your tray is empty</p>
                    <p className="text-xs text-gray-400">Add artisanal coffee or pastries from the menu!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1.5 rounded-xl bg-white shadow-xs">
                          {item.emoji}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-500 font-semibold">₹{item.price}</p>
                          {item.customization && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {item.customization.milk} • {item.customization.sugar}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center font-bold hover:bg-gray-100"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-bold text-sm text-gray-800 px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center font-bold hover:bg-gray-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Coupon Code Box */}
                {cart.length > 0 && (
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (Try COFFEEVIBES)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase font-bold focus:outline-none focus:border-primary"
                      />
                      <Button size="sm" onClick={applyCoupon} variant="secondary">
                        Apply
                      </Button>
                    </div>
                    {couponApplied && (
                      <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                        <Check size={14} /> Coupon applied: ₹50 discount!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Footer & Simulated Checkout */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-gray-150 bg-gray-50/50 space-y-3">
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">₹{subtotal}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span className="font-semibold text-gray-900">₹{tax}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-gray-950 pt-2 border-t border-gray-200">
                      <span>Total Amount</span>
                      <span className="text-primary text-base">₹{total}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                  >
                    <span>Proceed to Simulated Checkout</span>
                    <ArrowRight size={16} />
                  </Button>
                  <p className="text-[10px] text-center text-gray-400">
                    🔒 Pure simulation — no real payment or database change
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Simulated Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Simulated Guest Checkout</h3>
                    <p className="text-xs text-amber-700 font-semibold">Demo order — No real payment charged</p>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Fulfillment
                    </label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="dine-in">Dine-In</option>
                      <option value="takeaway">Takeaway</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Table / Note
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Simulated Payment Method */}
                <div>
                  <label className="font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Select Simulated Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / QR (Demo)' },
                      { id: 'card', label: 'Card (Demo)' },
                      { id: 'cash', label: 'Counter Cash' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                          paymentMethod === m.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Total Overview */}
              <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-gray-900">Total Simulation Amount</p>
                  <p className="text-gray-500">{cart.length} items with taxes & discount</p>
                </div>
                <span className="text-xl font-black text-primary">₹{total}</span>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setCheckoutOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="flex-2 flex items-center justify-center gap-2 cursor-pointer"
                  onClick={handleSimulatedCheckout}
                >
                  <CheckCircle2 size={18} /> Confirm Simulated Order
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Simulated Order Tracking Modal */}
      <AnimatePresence>
        {completedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  Order Successfully Placed (Demo)
                </span>
                <h3 className="font-display text-2xl font-black text-gray-900 pt-2">
                  Ticket #{completedOrder.orderId}
                </h3>
                <p className="text-xs text-gray-500">
                  Fictional guest order for {completedOrder.customerName} • {completedOrder.tableNumber}
                </p>
              </div>

              {/* Order Status Stepper */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/60 text-left space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Live Kitchen Status Tracker
                </h4>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 size={16} /> Placed ({completedOrder.timestamp})
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                  <div className="flex items-center gap-1.5 text-primary animate-pulse">
                    <Clock size={16} /> Brewing in Kitchen
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                  <div className="text-gray-400">
                    Ready for Pickup
                  </div>
                </div>
              </div>

              {/* Simulated Items Receipt */}
              <div className="text-xs text-gray-600 space-y-1 text-left max-h-36 overflow-y-auto no-scrollbar border-y border-gray-150 py-3">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1 flex items-center justify-center gap-1.5"
                  onClick={() => setCompletedOrder(null)}
                >
                  <RefreshCw size={14} /> Order More Items
                </Button>
                <Button
                  className="flex-1 flex items-center justify-center gap-1.5"
                  onClick={handleSwitchToAdmin}
                >
                  <Sparkles size={14} className="text-amber-300" /> View on Kitchen KDS
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Footer */}
      <footer className="bg-white border-t border-gray-200/80 py-4 text-center text-xs text-gray-500">
        CafeVibes — Restaurant POS & Digital Kitchen Management (Customer Demo Experience)
      </footer>
    </div>
  );
};

export default CustomerDemo;
