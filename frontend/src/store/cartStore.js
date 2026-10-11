import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  customer: null,
  table: null,
  couponCode: '',
  orderId: null,

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.product === product._id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.product === product._id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            tax: product.tax,
            unit: product.unit,
            categoryColor: product.category?.color,
          },
        ],
      });
    }
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      set({ items: get().items.filter((i) => i.product !== productId) });
    } else {
      set({
        items: get().items.map((i) =>
          i.product === productId ? { ...i, quantity } : i
        ),
      });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product !== productId) });
  },

  setCustomer: (customer) => set({ customer }),
  setTable: (table) => set({ table }),
  setCouponCode: (couponCode) => set({ couponCode }),
  setOrderId: (orderId) => set({ orderId }),

  getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  getTax: () =>
    get().items.reduce((sum, i) => sum + (i.price * i.quantity * (i.tax || 0)) / 100, 0),

  getTotal: () => get().getSubtotal() + get().getTax(),

  clearCart: () => set({ items: [], customer: null, table: null, couponCode: '', orderId: null }),
}));

export default useCartStore;
