import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, QrCode, X, Play, LogOut, FileText, Pencil, User, Check, MapPin, Layers, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useCartStore from '../store/cartStore';
import { productAPI, categoryAPI, customerAPI, floorAPI, orderAPI, paymentAPI, couponAPI, receiptAPI, posSessionAPI, settingsAPI } from '../services/endpoints';
import { formatCurrency, formatDateTime, sortTablesFloorAndRowWise, getSeatDots, getTableShapeClass } from '../utils/helpers';

const POS = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [lastClosedSession, setLastClosedSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [closeSummaryModal, setCloseSummaryModal] = useState(false);
  const [closedSessionSummary, setClosedSessionSummary] = useState(null);
  
  // Cash Drawer Management states
  const [openSessionModal, setOpenSessionModal] = useState(false);
  const [openingBalanceInput, setOpeningBalanceInput] = useState('');
  const [closeSessionModal, setCloseSessionModal] = useState(false);
  const [closingBalanceInput, setClosingBalanceInput] = useState('');
  const [drawerTransactionModal, setDrawerTransactionModal] = useState(false);
  const [drawerTxForm, setDrawerTxForm] = useState({ type: 'in', amount: '', reason: '' });
  const [submittingDrawerTx, setSubmittingDrawerTx] = useState(false);
  const [drawerLogOpen, setDrawerLogOpen] = useState(false);
  
  // Customer management states
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '' });

  // Floor plan / Table selection states
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [activeFloorId, setActiveFloorId] = useState(''); // empty string represents 'All Floors'
  
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get().then((r) => r.data.data),
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['pos-products', search, activeCategory],
    queryFn: () => productAPI.getAll({ search: search || undefined, category: activeCategory || undefined, isActive: true }).then((r) => r.data.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll({ isActive: true }).then((r) => r.data.data),
  });

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerAPI.getAll().then((r) => r.data.data),
  });

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => floorAPI.getTables({ isActive: true }).then((r) => r.data.data),
  });

  const { data: floors } = useQuery({
    queryKey: ['floors'],
    queryFn: () => floorAPI.getFloors().then((r) => r.data.data),
  });

  const fetchSessionStatus = async (showLoading = false) => {
    try {
      if (showLoading) setCheckingSession(true);
      const activeRes = await posSessionAPI.getActive();
      setActiveSession(activeRes.data.data);
      
      const lastClosedRes = await posSessionAPI.getLastClosed();
      setLastClosedSession(lastClosedRes.data.data);
    } catch (err) {
      console.error('Failed to fetch POS session details:', err);
    } finally {
      if (showLoading) setCheckingSession(false);
    }
  };

  useEffect(() => {
    fetchSessionStatus(true);
  }, []);

  useEffect(() => {
    if (floors && floors.length > 0 && !activeFloorId) {
      setActiveFloorId(floors[0]._id);
    }
  }, [floors, activeFloorId]);

  const getFloorTableStats = (floorId) => {
    if (!tables) return { available: 0, total: 0 };
    const floorTables = floorId ? tables.filter(t => t.floor?._id === floorId || t.floor === floorId) : tables;
    const total = floorTables.length;
    const available = floorTables.filter(t => t.status === 'available').length;
    return { available, total };
  };



  useEffect(() => {
    if (settings?.paymentMethods) {
      if (settings.paymentMethods.cash) {
        setPaymentMethod('cash');
      } else if (settings.paymentMethods.card) {
        setPaymentMethod('card');
      } else if (settings.paymentMethods.upi) {
        setPaymentMethod('upi');
      }
    }
  }, [settings]);

  const handleOpenSession = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await posSessionAPI.open({ openingBalance: Number(openingBalanceInput) || 0 });
      setActiveSession(res.data.data);
      fetchSessionStatus(false);
      setOpenSessionModal(false);
      setOpeningBalanceInput('');
      toast.success('POS Session opened successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to open POS session');
    }
  };

  const handleCloseSession = async (e) => {
    if (e) e.preventDefault();
    if (!activeSession) return;
    try {
      const res = await posSessionAPI.close(activeSession._id, { closingBalance: Number(closingBalanceInput) || 0 });
      setClosedSessionSummary(res.data.data);
      setCloseSummaryModal(true);
      setCloseSessionModal(false);
      setClosingBalanceInput('');
      setActiveSession(null);
      fetchSessionStatus(false);
      toast.success('POS Session closed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close POS session');
    }
  };

  const handleAddDrawerTransaction = async (e) => {
    e.preventDefault();
    setSubmittingDrawerTx(true);
    try {
      const res = await posSessionAPI.addCashTransaction({
        type: drawerTxForm.type,
        amount: Number(drawerTxForm.amount),
        reason: drawerTxForm.reason
      });
      setActiveSession(res.data.data);
      setDrawerTransactionModal(false);
      setDrawerTxForm({ type: 'in', amount: '', reason: '' });
      toast.success(`Logged cash ${drawerTxForm.type === 'in' ? 'in' : 'out'} of the drawer`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log drawer transaction');
    } finally {
      setSubmittingDrawerTx(false);
    }
  };

  const getExpectedCash = () => {
    if (!activeSession) return 0;
    const opening = activeSession.openingBalance || 0;
    const cashSales = activeSession.salesBreakdown?.cash || 0;
    const manualCash = (activeSession.cashTransactions || []).reduce((sum, tx) => {
      if (tx.type === 'in') return sum + tx.amount;
      if (tx.type === 'out') return sum - tx.amount;
      return sum;
    }, 0);
    return Math.round((opening + cashSales + manualCash) * 100) / 100;
  };

  const handleDownloadPDF = async (id, orderNumber) => {
    if (!id) return;
    try {
      const { data } = await receiptAPI.downloadPDF(id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${orderNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  const handleSendEmail = async () => {
    if (!emailInput) {
      toast.error('Please enter an email address');
      return;
    }
    setSendingEmail(true);
    try {
      await receiptAPI.email(completedOrder._id, emailInput);
      toast.success(`Receipt sent to ${emailInput}`);
      setEmailInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const { items, customer, table, couponCode, addItem, updateQuantity, removeItem, setCustomer, setTable, setCouponCode, getSubtotal, getTax, getTotal, clearCart } = useCartStore();

  const createOrderMutation = useMutation({
    mutationFn: (data) => orderAPI.create(data),
    onSuccess: (res) => {
      toast.success('Order created');
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      return res.data.data;
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create order'),
  });

  // Customer Mutations
  const createCustomerMutation = useMutation({
    mutationFn: (data) => {
      const submitData = { ...data };
      if (!submitData.email) delete submitData.email;
      if (!submitData.phone) delete submitData.phone;
      return customerAPI.create(submitData);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully!');
      setCustomer(res.data.data._id); // Automatically select newly created customer
      setCustomerFormOpen(false);
      setCustomerForm({ name: '', email: '', phone: '' });
      setCustomerModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create customer');
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const submitData = { ...data };
      if (!submitData.email) delete submitData.email;
      if (!submitData.phone) delete submitData.phone;
      return customerAPI.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully!');
      setCustomerFormOpen(false);
      setEditingCustomer(null);
      setCustomerForm({ name: '', email: '', phone: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update customer');
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id) => customerAPI.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
      if (customer === id) {
        setCustomer(null); // Clear selected if deleted
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete customer');
    },
  });

  const payMutation = useMutation({
    mutationFn: ({ orderId, data }) => paymentAPI.process(orderId, data),
    onSuccess: (res) => {
      toast.success('Payment successful!');
      const completed = res.data.data;
      setCompletedOrder(completed);
      
      // Prefill email for receipt delivery if customer email is available
      if (completed.customer?.email) {
        setEmailInput(completed.customer.email);
      } else {
        setEmailInput('');
      }

      setSuccessModal(true);
      clearCart();
      setPaymentModal(false);
      setQrCode(null);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Payment failed'),
  });

  const handlePlaceOrder = async () => {
    if (!items.length) { toast.error('Cart is empty'); return; }

    const orderData = {
      items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
      customer: customer || undefined,
      table: table || undefined,
      couponCode: couponCode || undefined,
    };

    const result = await createOrderMutation.mutateAsync(orderData);
    const orderId = result.data.data._id;
    setPaymentModal(true);
    useCartStore.getState().setOrderId(orderId);
  };

  const handlePayment = async () => {
    const orderId = useCartStore.getState().orderId;
    if (!orderId) return;

    const data = { method: paymentMethod };
    if (paymentMethod === 'cash') {
      data.amount = Number(cashAmount);
    }

    payMutation.mutate({ orderId, data });
  };

  const handleGenerateQR = async () => {
    const orderId = useCartStore.getState().orderId;
    if (!orderId) {
      const orderData = {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        customer: customer || undefined,
        table: table || undefined,
      };
      const result = await createOrderMutation.mutateAsync(orderData);
      const createdId = result.data.data._id;
      useCartStore.getState().setOrderId(createdId);
      const { data } = await paymentAPI.getQR(createdId);
      setQrCode(data.data.qrCode);
      setPaymentModal(true);
      setPaymentMethod('upi');
    } else {
      const { data } = await paymentAPI.getQR(orderId);
      setQrCode(data.data.qrCode);
    }
  };

  const handleValidateCoupon = async () => {
    if (!couponCode) return;
    try {
      const { data } = await couponAPI.validate({ code: couponCode, orderAmount: getSubtotal() });
      toast.success(`Coupon applied! Discount: ${formatCurrency(data.data.discount)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  if (checkingSession) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {!activeSession ? (
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center p-4">
          <div className="w-full max-w-lg card !p-8 text-center space-y-6 shadow-xl border border-gray-100/50 backdrop-blur-sm bg-white/95 relative overflow-hidden">
            {/* Design accents */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary to-primary-700" />
            
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <Play className="w-10 h-10 fill-primary/10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">POS Terminal</h1>
              <p className="text-gray-500 text-sm">To start processing orders, please open a new register session for your shift.</p>
            </div>

            {lastClosedSession ? (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left space-y-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Last Session Info</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 block">Session Opened On</span>
                    <span className="text-sm font-semibold text-gray-800">{formatDateTime(lastClosedSession.openedAt)}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 block">Closing Sales Amount</span>
                    <span className="text-sm font-bold text-primary">{formatCurrency(lastClosedSession.totalSales || 0)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 text-center text-sm text-primary font-medium">
                No previous sessions found. Start your first POS session today!
              </div>
            )}

            <Button
              onClick={() => { setOpeningBalanceInput(''); setOpenSessionModal(true); }}
              className="w-full py-4 text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150"
            >
              Open New Session
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
        {/* Products Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-3 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">POS Terminal</h1>
              {activeSession && (
                <p className="text-xs text-gray-500">
                  Session started: {formatDateTime(activeSession.openedAt)}
                </p>
              )}
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => { setClosingBalanceInput(''); setCloseSessionModal(true); }}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Close Shift
            </Button>
          </div>

          {/* Cash Drawer Widget */}
          <div className="mb-3 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-gray-100 flex flex-wrap gap-4 items-center justify-between shadow-sm">
            <div className="flex gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Opening Cash</span>
                <span className="text-sm font-semibold text-gray-800 block">{formatCurrency(activeSession?.openingBalance || 0)}</span>
              </div>
              <div className="w-px h-8 bg-gray-100 self-center" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Cash Sales</span>
                <span className="text-sm font-semibold text-green-600 block">+{formatCurrency(activeSession?.salesBreakdown?.cash || 0)}</span>
              </div>
              <div className="w-px h-8 bg-gray-100 self-center" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Expected in Drawer</span>
                <span className="text-sm font-extrabold text-primary block">{formatCurrency(getExpectedCash())}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="xs"
                onClick={() => setDrawerLogOpen(true)}
                className="text-xs py-1.5 px-3"
              >
                View Cash Log
              </Button>
              <Button
                variant="primary"
                size="xs"
                onClick={() => {
                  setDrawerTxForm({ type: 'in', amount: '', reason: '' });
                  setDrawerTransactionModal(true);
                }}
                className="text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Plus size={12} /> Cash In / Out
              </Button>
            </div>
          </div>

          <div className="relative mb-3">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
            <button onClick={() => setActiveCategory('')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${!activeCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
            {categories?.map((c) => (
              <button key={c._id} onClick={() => setActiveCategory(c._id)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap`} style={activeCategory === c._id ? { backgroundColor: c.color, color: '#fff' } : { backgroundColor: `${c.color}20`, color: c.color }}>
                {c.name}
              </button>
            ))}
          </div>

          {isLoading ? <LoadingSpinner className="flex-1" /> : (
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
              {products?.map((product) => (
                <button
                  key={product._id}
                  onClick={() => addItem(product)}
                  className="card p-3 text-left hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all"
                >
                  <div className="w-full h-1 rounded-full mb-2" style={{ backgroundColor: product.category?.color || '#0F766E' }} />
                  <p className="font-medium text-sm text-gray-800 truncate">{product.name}</p>
                  <p className="text-primary font-bold text-sm mt-1">{formatCurrency(product.price)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart Panel */}
        <div className="w-full lg:w-80 flex flex-col card !p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Cart ({items.length})</h2>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => {
                setCustomerSearch('');
                setCustomerFormOpen(false);
                setEditingCustomer(null);
                setCustomerModalOpen(true);
              }}
              className="input-field text-xs flex-1 text-left flex items-center justify-between hover:bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 transition-colors"
            >
              <span className="truncate max-w-[100px] font-medium text-gray-700">
                {customers?.find((c) => c._id === customer)?.name || 'Walk-in Customer'}
              </span>
              <Search size={14} className="text-gray-400 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => {
                setTableModalOpen(true);
              }}
              className="input-field text-xs flex-1 text-left flex items-center justify-between hover:bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 transition-colors"
            >
              <span className="truncate max-w-[100px] font-medium text-gray-700 flex items-center gap-1.5">
                <MapPin size={14} className="text-primary shrink-0" />
                <span className="truncate">
                  {tables?.find((t) => t._id === table)?.name || 'No Table'}
                </span>
              </span>
              <Layers size={14} className="text-gray-400 shrink-0" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 mb-3 min-h-[120px]">
            {items.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No items in cart</p>
            ) : items.map((item) => (
              <div key={item.product} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-white flex items-center justify-center"><Minus size={12} /></button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-white flex items-center justify-center"><Plus size={12} /></button>
                </div>
                <button onClick={() => removeItem(item.product)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
            <div className="flex gap-2 mb-2">
              <input className="input-field text-xs flex-1" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <Button size="sm" variant="secondary" onClick={handleValidateCoupon}>Apply</Button>
            </div>
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(getSubtotal())}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatCurrency(getTax())}</span></div>
            <div className="flex justify-between font-bold text-lg text-primary pt-1"><span>Total</span><span>{formatCurrency(getTotal())}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button variant="secondary" onClick={clearCart} disabled={!items.length}>Clear</Button>
            <Button onClick={handlePlaceOrder} disabled={!items.length} loading={createOrderMutation.isPending}>Pay</Button>
          </div>
        </div>
      </div>
      )}

      <Modal isOpen={paymentModal} onClose={() => { setPaymentModal(false); setQrCode(null); }} title="Payment" size="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'cash', icon: Banknote, label: 'Cash', enabled: settings?.paymentMethods?.cash ?? true },
              { id: 'card', icon: CreditCard, label: 'Card', enabled: settings?.paymentMethods?.card ?? true },
              { id: 'upi', icon: QrCode, label: 'UPI', enabled: settings?.paymentMethods?.upi ?? true },
            ].filter(m => m.enabled).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setPaymentMethod(id); if (id === 'upi') handleGenerateQR(); }}
                className={`p-3 rounded-xl border-2 text-center transition-all ${paymentMethod === id ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
              >
                <Icon size={20} className="mx-auto mb-1 text-primary" />
                <p className="text-xs font-medium">{label}</p>
              </button>
            ))}
          </div>

          {[
            { id: 'cash', enabled: settings?.paymentMethods?.cash ?? true },
            { id: 'card', enabled: settings?.paymentMethods?.card ?? true },
            { id: 'upi', enabled: settings?.paymentMethods?.upi ?? true },
          ].filter(m => m.enabled).length === 0 && (
            <p className="text-center text-red-500 text-sm font-medium py-4">
              All payment methods are currently disabled. Please contact the administrator.
            </p>
          )}

          {paymentMethod === 'cash' && (
            <div>
              <label className="text-sm text-gray-600">Cash Received</label>
              <input type="number" className="input-field mt-1" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} placeholder="0.00" />
              {cashAmount && Number(cashAmount) >= getTotal() && (
                <p className="text-sm text-green-600 mt-1">Change: {formatCurrency(Number(cashAmount) - getTotal())}</p>
              )}
            </div>
          )}

          {paymentMethod === 'upi' && qrCode && (
            <div className="text-center">
              <img src={qrCode} alt="UPI QR" className="mx-auto w-48 h-48 rounded-xl" />
              <p className="text-sm text-gray-500 mt-2">Scan to pay {formatCurrency(getTotal())}</p>
            </div>
          )}

          <Button className="w-full" onClick={handlePayment} loading={payMutation.isPending}>
            Complete Payment
          </Button>
        </div>
      </Modal>

      <Modal isOpen={successModal} onClose={() => { setSuccessModal(false); setCompletedOrder(null); }} title="Order Completed" size="sm">
        <div className="space-y-4 text-center py-2">
          {/* Animated checkmark */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 border-2 border-green-500 text-green-600 animate-pulse">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800">Payment Successful!</h3>
            <p className="text-sm text-gray-500 mt-1">Order has been sent to the kitchen queue.</p>
          </div>

          {completedOrder && (
            <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Number</span>
                <span className="font-bold text-gray-800">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium text-gray-800">{completedOrder.customer?.name || 'Walk-in'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-800 uppercase">{completedOrder.payment?.method}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between font-bold text-base text-primary">
                <span>Total Paid</span>
                <span>{formatCurrency(completedOrder.total)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => handleDownloadPDF(completedOrder?._id, completedOrder?.orderNumber)}
              disabled={!completedOrder}
            >
              Download PDF
            </Button>
            <Button
              className="flex-1"
              onClick={() => { setSuccessModal(false); setCompletedOrder(null); }}
            >
              New Order
            </Button>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider text-left mb-1.5">Email Receipt</label>
            <div className="flex gap-2">
              <input
                type="email"
                className="input-field text-xs flex-1"
                placeholder="customer@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <Button
                size="sm"
                onClick={handleSendEmail}
                loading={sendingEmail}
                disabled={!completedOrder}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={closeSummaryModal}
        onClose={() => { setCloseSummaryModal(false); setClosedSessionSummary(null); }}
        title="Shift Closing Summary"
        size="md"
      >
        {closedSessionSummary && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Shift Session Finished</p>
              <h3 className="text-3xl font-extrabold text-primary mt-1">
                {formatCurrency(closedSessionSummary.totalSales || 0)}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Total Sales Generated</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-medium">Session Started</span>
                <span className="font-semibold text-gray-800">
                  {formatDateTime(closedSessionSummary.openedAt)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-medium">Session Ended</span>
                <span className="font-semibold text-gray-800">
                  {formatDateTime(closedSessionSummary.closedAt)}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-200/50 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Total Orders Handled</span>
                <span className="font-bold text-gray-800 text-base">
                  {closedSessionSummary.ordersCount || 0}
                </span>
              </div>
            </div>

            {/* Cash Drawer Reconciliation */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cash Drawer Reconciliation</h4>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Opening Balance:</span>
                  <span className="font-semibold text-gray-700">{formatCurrency(closedSessionSummary.openingBalance || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cash Sales:</span>
                  <span className="font-semibold text-green-600">+{formatCurrency(closedSessionSummary.salesBreakdown?.cash || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Manual Adjustments (Net):</span>
                  <span className="font-semibold text-gray-700">
                    {formatCurrency((closedSessionSummary.cashTransactions || []).reduce((sum, tx) => tx.type === 'in' ? sum + tx.amount : sum - tx.amount, 0))}
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-1 pt-1.5 flex justify-between">
                  <span className="text-gray-500 font-medium">Expected Drawer Balance:</span>
                  <span className="font-bold text-gray-800">
                    {formatCurrency(
                      (closedSessionSummary.openingBalance || 0) +
                      (closedSessionSummary.salesBreakdown?.cash || 0) +
                      (closedSessionSummary.cashTransactions || []).reduce((sum, tx) => tx.type === 'in' ? sum + tx.amount : sum - tx.amount, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Actual Counted Balance:</span>
                  <span className="font-bold text-gray-800">{formatCurrency(closedSessionSummary.closingBalance || 0)}</span>
                </div>
                
                {(() => {
                  const expected = (closedSessionSummary.openingBalance || 0) +
                    (closedSessionSummary.salesBreakdown?.cash || 0) +
                    (closedSessionSummary.cashTransactions || []).reduce((sum, tx) => tx.type === 'in' ? sum + tx.amount : sum - tx.amount, 0);
                  const actual = closedSessionSummary.closingBalance || 0;
                  const diff = Math.round((actual - expected) * 100) / 100;
                  
                  if (diff === 0) {
                    return (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 text-center text-xs font-bold text-green-700">
                        Drawer Balanced (No Discrepancy)
                      </div>
                    );
                  } else if (diff < 0) {
                    return (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-center text-xs font-bold text-red-700 flex justify-between">
                        <span>Discrepancy (Shortage):</span>
                        <span>{formatCurrency(diff)} Short</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-2.5 text-center text-xs font-bold text-yellow-700 flex justify-between">
                        <span>Discrepancy (Surplus):</span>
                        <span>+{formatCurrency(diff)} Overage</span>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Breakdown</h4>
              <div className="space-y-2">
                {[
                  { label: 'Cash Payments', value: closedSessionSummary.salesBreakdown?.cash || 0, icon: Banknote, color: 'bg-green-50 text-green-600 border-green-100' },
                  { label: 'Card Payments', value: closedSessionSummary.salesBreakdown?.card || 0, icon: CreditCard, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                  { label: 'UPI Payments', value: closedSessionSummary.salesBreakdown?.upi || 0, icon: QrCode, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className={`flex items-center justify-between p-3 rounded-xl border ${color}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={18} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-2"
              onClick={() => { setCloseSummaryModal(false); setClosedSessionSummary(null); }}
            >
              Done & Close Summary
            </Button>
          </div>
        )}
      </Modal>

      {/* Open Register Session Modal */}
      <Modal
        isOpen={openSessionModal}
        onClose={() => setOpenSessionModal(false)}
        title="Open Register Session"
        size="sm"
      >
        <form onSubmit={handleOpenSession} className="space-y-4">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 space-y-2">
            <h4 className="text-sm font-semibold text-primary">Initial Cash Amount In</h4>
            <p className="text-xs text-gray-500">Please enter the starting cash amount (float) in the drawer to open the shift.</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cash Amount In (Opening Balance)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                className="input-field pl-8 font-semibold"
                placeholder="0.00"
                value={openingBalanceInput}
                onChange={(e) => setOpeningBalanceInput(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>
          <Button type="submit" className="w-full py-3">
            Open Register & Start Shift
          </Button>
        </form>
      </Modal>

      {/* Close Register Session Modal */}
      <Modal
        isOpen={closeSessionModal}
        onClose={() => setCloseSessionModal(false)}
        title="Close Shift Session"
        size="sm"
      >
        <form onSubmit={handleCloseSession} className="space-y-4">
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100 space-y-2 text-sm">
            <h4 className="text-sm font-semibold text-red-700">Closing Register Verification</h4>
            <p className="text-xs text-red-600/80">Make sure all orders have been paid or saved before closing your shift register.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Opening Cash Balance:</span>
              <span className="font-semibold text-gray-700">{formatCurrency(activeSession?.openingBalance || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Cash Sales:</span>
              <span className="font-semibold text-green-600">+{formatCurrency(activeSession?.salesBreakdown?.cash || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Manual Cash Adjustments:</span>
              <span className="font-semibold text-gray-700">
                {formatCurrency((activeSession?.cashTransactions || []).reduce((sum, tx) => tx.type === 'in' ? sum + tx.amount : sum - tx.amount, 0))}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
              <span>Expected Cash in Drawer:</span>
              <span>{formatCurrency(getExpectedCash())}</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Counted Cash Amount in Drawer</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                className="input-field pl-8 font-semibold"
                placeholder="0.00"
                value={closingBalanceInput}
                onChange={(e) => setClosingBalanceInput(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>
          <Button type="submit" variant="danger" className="w-full py-3">
            Verify & Close Shift Register
          </Button>
        </form>
      </Modal>

      {/* Cash Transaction Entry Modal (Cash In / Out) */}
      <Modal
        isOpen={drawerTransactionModal}
        onClose={() => setDrawerTransactionModal(false)}
        title="Register Cash Transaction"
        size="sm"
      >
        <form onSubmit={handleAddDrawerTransaction} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDrawerTxForm({ ...drawerTxForm, type: 'in' })}
                className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${drawerTxForm.type === 'in' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-500'}`}
              >
                Cash In (Pay-In)
              </button>
              <button
                type="button"
                onClick={() => setDrawerTxForm({ ...drawerTxForm, type: 'out' })}
                className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${drawerTxForm.type === 'out' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 text-gray-500'}`}
              >
                Cash Out (Payout)
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cash Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                className="input-field pl-8 font-semibold"
                placeholder="0.00"
                value={drawerTxForm.amount}
                onChange={(e) => setDrawerTxForm({ ...drawerTxForm, amount: e.target.value })}
                required
                min="0.01"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason / Description</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Milk delivery payment, Additional float change"
              value={drawerTxForm.reason}
              onChange={(e) => setDrawerTxForm({ ...drawerTxForm, reason: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full py-3" loading={submittingDrawerTx}>
            Record Cash Drawer Entry
          </Button>
        </form>
      </Modal>

      {/* Cash Drawer Log Modal */}
      <Modal
        isOpen={drawerLogOpen}
        onClose={() => setDrawerLogOpen(false)}
        title="Cash Drawer Logs"
        size="md"
      >
        <div className="space-y-4 font-sans">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex justify-between text-sm">
            <div className="space-y-0.5">
              <span className="text-xs text-gray-400 font-medium">Opening Balance</span>
              <span className="font-bold text-gray-800 block">{formatCurrency(activeSession?.openingBalance || 0)}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-gray-400 font-medium">Cash Sales</span>
              <span className="font-bold text-green-600 block">+{formatCurrency(activeSession?.salesBreakdown?.cash || 0)}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-gray-400 font-medium">Expected in Drawer</span>
              <span className="font-bold text-primary block">{formatCurrency(getExpectedCash())}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cash Operations History</h4>
            <div className="overflow-hidden border border-gray-100 rounded-2xl max-h-[300px] overflow-y-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                    <th className="py-2.5 px-4">Time</th>
                    <th className="py-2.5 px-4">Reason</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-4 text-xs font-medium text-gray-400">{formatDateTime(activeSession?.openedAt)}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-800">Opening Register Balance</td>
                    <td className="py-2.5 px-4 text-right font-bold text-gray-800">{formatCurrency(activeSession?.openingBalance || 0)}</td>
                  </tr>
                  
                  {activeSession?.salesBreakdown?.cash > 0 && (
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-4 text-xs font-medium text-gray-400">---</td>
                      <td className="py-2.5 px-4 font-medium text-gray-800">Total Shift Cash Sales</td>
                      <td className="py-2.5 px-4 text-right font-bold text-green-600">+{formatCurrency(activeSession.salesBreakdown.cash)}</td>
                    </tr>
                  )}

                  {(!activeSession?.cashTransactions || activeSession.cashTransactions.length === 0) ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-gray-400 text-sm">No manual adjustments logged in this shift.</td>
                    </tr>
                  ) : (
                    activeSession.cashTransactions.map((tx) => (
                      <tr key={tx._id || tx.createdAt} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-4 text-xs font-medium text-gray-400">{formatDateTime(tx.createdAt)}</td>
                        <td className="py-2.5 px-4 font-medium text-gray-800">
                          {tx.reason}
                          <span className={`inline-block ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tx.type === 'in' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {tx.type === 'in' ? 'Cash In' : 'Cash Out'}
                          </span>
                        </td>
                        <td className={`py-2.5 px-4 text-right font-bold ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'in' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      {/* Customer Selection & Management Modal */}
      <Modal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title={customerFormOpen ? (editingCustomer ? 'Edit Customer' : 'Add New Customer') : 'Select Customer'}
        size="md"
      >
        {customerFormOpen ? (
          /* Add / Edit Customer Form */
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingCustomer) {
                updateCustomerMutation.mutate({ id: editingCustomer._id, data: customerForm });
              } else {
                createCustomerMutation.mutate(customerForm);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name *</label>
              <input
                type="text"
                className="input-field text-sm"
                placeholder="Jane Doe"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email (Optional)</label>
              <input
                type="email"
                className="input-field text-sm"
                placeholder="jane@example.com"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone (Optional)</label>
              <input
                type="text"
                className="input-field text-sm"
                placeholder="9876543210"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setCustomerFormOpen(false);
                  setEditingCustomer(null);
                }}
              >
                Back to List
              </Button>
              <Button
                type="submit"
                loading={createCustomerMutation.isPending || updateCustomerMutation.isPending}
              >
                {editingCustomer ? 'Update Customer' : 'Save Customer'}
              </Button>
            </div>
          </form>
        ) : (
          /* Customer Search and List view */
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10 text-sm"
                  placeholder="Search name, email, or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={() => {
                  setEditingCustomer(null);
                  setCustomerForm({ name: '', email: '', phone: '' });
                  setCustomerFormOpen(true);
                }}
                className="shrink-0 text-xs px-3"
              >
                <Plus size={16} className="mr-1" /> New
              </Button>
            </div>

            {/* List of Customers */}
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {/* Default Walk-in option */}
              <div
                onClick={() => {
                  setCustomer(null);
                  setCustomerModalOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50/50 ${
                  !customer ? 'border-primary bg-primary/5' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">Walk-in Customer</h4>
                    <p className="text-xs text-gray-400">Anonymous order</p>
                  </div>
                </div>
                {!customer && <Check size={18} className="text-primary" />}
              </div>

              {/* Matching Customers */}
              {customers
                ?.filter((c) => {
                  if (!customerSearch) return true;
                  const query = customerSearch.toLowerCase();
                  return (
                    c.name.toLowerCase().includes(query) ||
                    (c.email && c.email.toLowerCase().includes(query)) ||
                    (c.phone && c.phone.includes(query))
                  );
                })
                .map((c) => {
                  const isSelected = customer === c._id;
                  return (
                    <div
                      key={c._id}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all hover:bg-gray-50/50 ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-gray-100'
                      }`}
                    >
                      <div
                        onClick={() => {
                          setCustomer(c._id);
                          setCustomerModalOpen(false);
                        }}
                        className="flex-1 flex items-center gap-2.5 cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                          <User size={16} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-850">{c.name}</h4>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">
                            {c.email || 'No email'} {c.phone ? `• ${c.phone}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCustomer(c);
                            setCustomerForm({ name: c.name, email: c.email || '', phone: c.phone || '' });
                            setCustomerFormOpen(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-850 transition-colors"
                          title="Edit Customer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={deleteCustomerMutation.isPending}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${c.name}?`)) {
                              deleteCustomerMutation.mutate(c._id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 size={14} />
                        </button>
                        {isSelected && <Check size={18} className="text-primary ml-1" />}
                      </div>
                    </div>
                  );
                })}

              {customers?.filter((c) => {
                if (!customerSearch) return true;
                const query = customerSearch.toLowerCase();
                return (
                  c.name.toLowerCase().includes(query) ||
                  (c.email && c.email.toLowerCase().includes(query)) ||
                  (c.phone && c.phone.includes(query))
                );
              }).length === 0 && (
                <p className="text-center text-sm text-gray-400 py-6">No matching customers found</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Floor Plan & Table Selection Modal */}
      <Modal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        title="Select Table / Floor Plan"
        size="lg"
      >
        <div className="flex flex-col md:flex-row gap-4 h-[450px]">
          {/* Left Panel: Floors Sidebar */}
          <div className="w-full md:w-48 flex flex-col gap-2 overflow-y-auto border-r border-gray-105 pr-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">Floors</div>
            
            {/* All Floors Option */}
            <button
              onClick={() => setActiveFloorId('')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all text-xs font-medium ${
                activeFloorId === ''
                  ? 'border-primary bg-primary/5 text-primary shadow-sm'
                  : 'border-gray-100 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers size={14} />
                <span>All Floors</span>
              </span>
              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                {tables ? tables.length : 0}
              </span>
            </button>

            {/* Individual Floors */}
            {floors?.map((floor) => {
              const stats = getFloorTableStats(floor._id);
              const isSelected = activeFloorId === floor._id;
              return (
                <button
                  key={floor._id}
                  onClick={() => setActiveFloorId(floor._id)}
                  className={`flex flex-col gap-1 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    <MapPin size={14} className={isSelected ? 'text-primary' : 'text-gray-400'} />
                    <span className="truncate">{floor.name}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium pl-5 font-mono">
                    {stats.available} / {stats.total} available
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Architectural Table Grid */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar / Action Panel */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500">
                {activeFloorId === ''
                  ? 'Showing all active tables'
                  : `Floor: ${floors?.find(f => f._id === activeFloorId)?.name || ''}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs py-1.5 px-3 h-auto"
                onClick={() => {
                  setTable(null);
                  setTableModalOpen(false);
                }}
              >
                No Table (Takeaway)
              </Button>
            </div>

            {/* Grid Canvas */}
            <div className="flex-1 overflow-y-auto min-h-[300px] border border-gray-50 rounded-2xl bg-gray-50/30 p-4">
              {(() => {
                if (activeFloorId === '') {
                  // ALL FLOORS: Show separate rows for different floors
                  if (!floors || floors.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <Layers className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm font-semibold text-gray-500">No floors found</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      {floors.map((floor) => {
                        const floorTables = sortTablesFloorAndRowWise(
                          tables?.filter((t) => (t.floor?._id === floor._id || t.floor === floor._id) && t.status !== 'disabled' && t.isActive !== false)
                        );

                        return (
                          <div key={floor._id} className="space-y-2 pb-3 border-b border-gray-100/50 last:border-b-0">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-xs font-bold text-gray-800">{floor.name}</span>
                              <span className="text-[10px] bg-gray-105 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                                {floorTables.length} Tables
                              </span>
                            </div>

                            <div className="flex overflow-x-auto gap-4 py-3 px-1 no-scrollbar scroll-smooth">
                              {floorTables.length === 0 ? (
                                <span className="text-xs text-gray-400 italic pl-1">No tables on this floor.</span>
                              ) : (
                                floorTables.map((t) => {
                                  const isSelected = table === t._id;
                                  const isOccupied = t.status === 'occupied';
                                  const isReserved = t.status === 'reserved';

                                  let ringStyleClass = 'hover:ring-primary/20';
                                  let accentBarClass = 'bg-emerald-500';
                                  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';

                                  if (isOccupied) {
                                    ringStyleClass = 'ring-1 ring-rose-100 hover:ring-2 hover:ring-rose-300';
                                    accentBarClass = 'bg-rose-500';
                                    badgeClass = 'bg-rose-50 text-rose-700 border-rose-100';
                                  } else if (isReserved) {
                                    ringStyleClass = 'ring-1 ring-amber-100 hover:ring-2 hover:ring-amber-300';
                                    accentBarClass = 'bg-amber-500';
                                    badgeClass = 'bg-amber-50 text-amber-700 border-amber-100';
                                  }

                                  return (
                                    <div
                                      key={t._id}
                                      onClick={() => {
                                        setTable(t._id);
                                        setTableModalOpen(false);
                                      }}
                                      className={`cursor-pointer transition-all duration-200 bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-[24px] p-4 flex flex-col justify-between w-44 h-36 relative overflow-hidden group shrink-0 ${
                                        isSelected
                                          ? 'ring-2 ring-primary ring-offset-1 scale-[0.98]'
                                          : ringStyleClass
                                      }`}
                                    >
                                      {/* Accent line */}
                                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${accentBarClass}`} />

                                      <div className="flex justify-center w-full">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold tracking-wider uppercase border shrink-0 ${badgeClass}`}>
                                          {t.status}
                                        </span>
                                      </div>

                                      {/* Card details */}
                                      <div className="my-2 space-y-1 text-[10px] w-full text-center">
                                        <div className="w-full">
                                          <span className="text-gray-400 font-semibold">Capacity </span>
                                          <span className="font-extrabold text-gray-700">{t.seatCount} Seats</span>
                                        </div>

                                        {isOccupied && (
                                          <div className="w-full mt-1">
                                            <span className="text-gray-455 font-semibold inline-flex items-center gap-0.5"><CreditCard size={10} className="text-rose-500" /> Bill </span>
                                            <span className="font-black text-rose-600">
                                              {t.currentOrder?.total ? formatCurrency(t.currentOrder.total) : '₹0.00'}
                                            </span>
                                          </div>
                                        )}

                                        {isReserved && (
                                          <div className="w-full mt-1">
                                            <span className="text-gray-455 font-semibold inline-flex items-center gap-0.5"><Clock size={10} className="text-amber-500" /> Res. Time </span>
                                            <span className="font-extrabold text-amber-600">{t.reservationTime || 'Pending'}</span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="text-sm font-extrabold border-t border-gray-100 pt-2 flex items-center justify-center w-full relative">
                                        <span className={isSelected ? 'text-primary' : 'text-gray-800'}>{t.name}</span>
                                        {isSelected && <Check size={12} className="text-primary font-black absolute right-0" />}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                } else {
                  // SPECIFIC FLOOR: Show a grid of tables
                  const floorTables = sortTablesFloorAndRowWise(
                    tables?.filter((t) => (t.floor?._id === activeFloorId || t.floor === activeFloorId) && t.status !== 'disabled' && t.isActive !== false)
                  );

                  if (!floorTables || floorTables.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <Layers className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm font-semibold text-gray-500">No active tables found</p>
                        <p className="text-xs text-gray-400 max-w-[200px] mt-0.5">Please add tables to this floor in layout manager.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
                      {floorTables.map((t) => {
                        const isSelected = table === t._id;
                        const isOccupied = t.status === 'occupied';
                        const isReserved = t.status === 'reserved';

                        let ringStyleClass = 'hover:ring-primary/20';
                        let accentBarClass = 'bg-emerald-500';
                        let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';

                        if (isOccupied) {
                          ringStyleClass = 'ring-1 ring-rose-100 hover:ring-2 hover:ring-rose-300';
                          accentBarClass = 'bg-rose-500';
                          badgeClass = 'bg-rose-50 text-rose-700 border-rose-100';
                        } else if (isReserved) {
                          ringStyleClass = 'ring-1 ring-amber-100 hover:ring-2 hover:ring-amber-300';
                          accentBarClass = 'bg-amber-500';
                          badgeClass = 'bg-amber-50 text-amber-700 border-amber-100';
                        }

                        return (
                          <div
                            key={t._id}
                            onClick={() => {
                              setTable(t._id);
                              setTableModalOpen(false);
                            }}
                            className={`cursor-pointer transition-all duration-200 bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-[24px] p-4 flex flex-col justify-between h-36 relative overflow-hidden group ${
                              isSelected
                                ? 'ring-2 ring-primary ring-offset-1 scale-[0.98]'
                                : ringStyleClass
                            }`}
                          >
                            {/* Accent line */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${accentBarClass}`} />

                            <div className="flex items-center justify-between gap-2 w-full">
                              <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold tracking-wider uppercase border shrink-0 ${badgeClass}`}>
                                {t.status}
                              </span>
                            </div>

                            {/* Card details */}
                            <div className="my-2 space-y-1 text-[10px] w-full">
                              <div className="flex justify-between items-center w-full">
                                <span className="text-gray-400 font-semibold">Capacity</span>
                                <span className="font-extrabold text-gray-700">{t.seatCount} Seats</span>
                              </div>

                              {isOccupied && (
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-gray-450 font-semibold flex items-center gap-0.5"><CreditCard size={10} className="text-rose-500" /> Bill</span>
                                  <span className="font-black text-rose-600">
                                    {t.currentOrder?.total ? formatCurrency(t.currentOrder.total) : '₹0.00'}
                                  </span>
                                </div>
                              )}

                              {isReserved && (
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-gray-450 font-semibold flex items-center gap-0.5"><Clock size={10} className="text-amber-500" /> Res. Time</span>
                                  <span className="font-extrabold text-amber-600">{t.reservationTime || 'Pending'}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-sm font-extrabold border-t border-gray-100 pt-2 flex items-center justify-between w-full">
                              <span className={isSelected ? 'text-primary' : 'text-gray-800'}>{t.name}</span>
                              {isSelected && <Check size={12} className="text-primary font-black" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              })()}
            </div>

            {/* Legend */}
            <div className="flex gap-4 items-center justify-center mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-sm" /> Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shadow-sm" /> Reserved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary ring-offset-1" /> Selected
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default POS;
