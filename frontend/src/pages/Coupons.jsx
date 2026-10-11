import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { couponAPI, productAPI } from '../services/endpoints';

const Coupons = () => {
  const [tab, setTab] = useState('coupons');
  const [modalOpen, setModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', type: 'percentage', value: '', minOrderAmount: 0 });
  const [promoForm, setPromoForm] = useState({
    name: '',
    type: 'percentage',
    value: '',
    autoApply: true,
    targetType: 'order',
    minOrderAmount: '',
    minQuantity: '',
    selectedProduct: '',
  });
  const queryClient = useQueryClient();

  const { data: coupons } = useQuery({ queryKey: ['coupons'], queryFn: () => couponAPI.getCoupons().then((r) => r.data.data) });
  const { data: promotions } = useQuery({ queryKey: ['promotions'], queryFn: () => couponAPI.getPromotions().then((r) => r.data.data) });
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => productAPI.getAll({ isActive: true }).then((r) => r.data.data) });

  const createCoupon = useMutation({
    mutationFn: (data) => couponAPI.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setModalOpen(false);
      setCouponForm({ code: '', type: 'percentage', value: '', minOrderAmount: 0 });
      toast.success('Coupon created');
    },
  });

  const createPromo = useMutation({
    mutationFn: (data) => couponAPI.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      setModalOpen(false);
      setPromoForm({
        name: '',
        type: 'percentage',
        value: '',
        autoApply: true,
        targetType: 'order',
        minOrderAmount: '',
        minQuantity: '',
        selectedProduct: '',
      });
      toast.success('Promotion created');
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: (id) => couponAPI.deleteCoupon(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coupons'] }); toast.success('Deleted'); },
  });

  const deletePromo = useMutation({
    mutationFn: (id) => couponAPI.deletePromotion(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['promotions'] }); toast.success('Deleted'); },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Coupons & Promotions</h1>
            <p className="text-gray-500 text-sm">Manage discounts and auto-apply promotions</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="shrink-0"><Plus size={16} /> Add {tab === 'coupons' ? 'Coupon' : 'Promotion'}</Button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab('coupons')} className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === 'coupons' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>Coupons</button>
          <button onClick={() => setTab('promotions')} className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === 'promotions' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>Promotions</button>
        </div>

        {tab === 'coupons' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons?.map((c) => (
              <div key={c._id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-bold text-primary">{c.code}</p>
                    <p className="text-sm text-gray-500">{c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}</p>
                    <p className="text-xs text-gray-400 mt-1">Used: {c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}</p>
                  </div>
                  <button onClick={() => deleteCoupon.mutate(c._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions?.map((p) => (
              <div key={p._id} className="card flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{p.name}</p>
                    <p className="text-sm font-semibold text-primary mt-0.5">{p.type === 'percentage' ? `${p.value}% off` : `₹${p.value} off`}</p>
                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                      {p.products && p.products.length > 0 ? (
                        <p className="flex items-center gap-1">
                          <span className="font-medium">Rule:</span> Buy {p.minQuantity}x {p.products[0]?.name || 'Unknown Product'}
                        </p>
                      ) : (
                        <p className="flex items-center gap-1">
                          <span className="font-medium">Rule:</span> Min order {p.minOrderAmount ? `₹${p.minOrderAmount}` : 'None'}
                        </p>
                      )}
                      {p.autoApply && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200 mt-1">
                          Auto Apply
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deletePromo.mutate(p._id)} className="p-1.5 hover:bg-red-55 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={tab === 'coupons' ? 'Add Coupon' : 'Add Promotion'}>
          {tab === 'coupons' ? (
            <form onSubmit={(e) => { e.preventDefault(); createCoupon.mutate({ ...couponForm, value: Number(couponForm.value) }); }} className="space-y-4">
              <Input label="Code" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} required />
              <select className="input-field" value={couponForm.type} onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <Input label="Value" type="number" value={couponForm.value} onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })} required />
              <Button type="submit" className="w-full">Create Coupon</Button>
            </form>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              const payload = {
                name: promoForm.name,
                type: promoForm.type,
                value: Number(promoForm.value),
                autoApply: promoForm.autoApply,
              };
              if (promoForm.targetType === 'product') {
                payload.products = [promoForm.selectedProduct];
                payload.minQuantity = Number(promoForm.minQuantity) || 1;
                payload.minOrderAmount = 0;
              } else {
                payload.products = [];
                payload.minQuantity = 0;
                payload.minOrderAmount = Number(promoForm.minOrderAmount) || 0;
              }
              createPromo.mutate(payload);
            }} className="space-y-4">
              <Input label="Name" value={promoForm.name} onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })} required />
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select className="input-field" value={promoForm.type} onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value })}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <Input label="Value" type="number" value={promoForm.value} onChange={(e) => setPromoForm({ ...promoForm, value: e.target.value })} required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Apply Rule Type</label>
                <select className="input-field" value={promoForm.targetType} onChange={(e) => setPromoForm({ ...promoForm, targetType: e.target.value })}>
                  <option value="order">Apply to Order (Min Total)</option>
                  <option value="product">Apply to Product (Min Qty)</option>
                </select>
              </div>

              {promoForm.targetType === 'order' ? (
                <Input label="Minimum Order Amount (₹)" type="number" value={promoForm.minOrderAmount} onChange={(e) => setPromoForm({ ...promoForm, minOrderAmount: e.target.value })} required />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Product</label>
                    <select className="input-field" value={promoForm.selectedProduct} onChange={(e) => setPromoForm({ ...promoForm, selectedProduct: e.target.value })} required>
                      <option value="">Select a product...</option>
                      {products?.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <Input label="Minimum Quantity" type="number" value={promoForm.minQuantity} onChange={(e) => setPromoForm({ ...promoForm, minQuantity: e.target.value })} required />
                </div>
              )}

              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" checked={promoForm.autoApply} onChange={(e) => setPromoForm({ ...promoForm, autoApply: e.target.checked })} />
                Auto Apply
              </label>
              <Button type="submit" className="w-full">Create Promotion</Button>
            </form>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Coupons;
