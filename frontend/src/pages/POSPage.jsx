const POSPage = () => {
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_380px_320px]">
      {/* Product Section */}
      <section className="overflow-y-auto border-r border-coffee/10 p-4">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {['All', 'Coffee', 'Tea', 'Snacks', 'Desserts'].map((cat) => (
            <button
              key={cat}
              className="whitespace-nowrap rounded-full border border-coffee/10 bg-white px-4 py-1.5 text-sm font-medium text-coffee/70 hover:border-teal hover:text-teal"
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="glass-card flex flex-col items-center justify-center rounded-2xl border border-white/40 p-4 text-center"
            >
              <div className="mb-2 h-10 w-10 rounded-full bg-teal/10" />
              <p className="text-sm font-medium text-coffee">Product {i + 1}</p>
              <p className="text-xs text-coffee/50">$0.00</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Section */}
      <section className="flex flex-col border-r border-coffee/10 bg-white/40 p-4">
        <h2 className="font-display text-lg font-semibold text-coffee">Cart</h2>
        <div className="mt-4 flex-1 rounded-xl border border-dashed border-coffee/20 p-6 text-center text-sm text-coffee/50">
          No items in cart yet. Tap a product to add it.
        </div>
        <div className="mt-4 space-y-2 border-t border-coffee/10 pt-4 text-sm">
          <div className="flex justify-between text-coffee/70">
            <span>Subtotal</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-coffee/70">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-coffee/70">
            <span>Discount</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between border-t border-coffee/10 pt-2 font-semibold text-coffee">
            <span>Total</span>
            <span>$0.00</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button className="rounded-lg bg-teal/10 py-2 text-sm font-medium text-teal">
            Customer
          </button>
          <button className="rounded-lg bg-teal/10 py-2 text-sm font-medium text-teal">
            Discount
          </button>
          <button className="rounded-lg bg-coffee/10 py-2 text-sm font-medium text-coffee">
            Send
          </button>
        </div>
        <button className="mt-2 rounded-lg bg-gold/30 py-2 text-sm font-semibold text-coffee">
          Send to Kitchen
        </button>
      </section>

      {/* Payment Section */}
      <section className="p-4">
        <h2 className="font-display text-lg font-semibold text-coffee">Payment</h2>
        <div className="mt-4 space-y-3">
          {['Cash', 'Card', 'UPI'].map((method) => (
            <button
              key={method}
              className="glass-card flex w-full items-center justify-between rounded-xl border border-white/40 px-4 py-3 text-sm font-medium text-coffee"
            >
              {method}
              <span className="text-coffee/40">›</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default POSPage;
