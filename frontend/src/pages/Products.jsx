import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { productAPI, categoryAPI } from '../services/endpoints';
import { formatCurrency } from '../utils/helpers';

const emptyForm = { name: '', category: '', price: '', unit: '1', tax: '5', description: '' };

const Products = () => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', search, filterCat],
    queryFn: () => productAPI.getAll({ search: search || undefined, category: filterCat || undefined }).then((r) => r.data.data),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? productAPI.update(editing, data) : productAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(editing ? 'Product updated' : 'Product created');
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
  });

  const openModal = (product = null) => {
    if (product) {
      setEditing(product._id);
      setForm({
        name: product.name, category: product.category?._id || product.category,
        price: product.price, unit: product.unit, tax: product.tax, description: product.description || '',
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({ ...form, price: Number(form.price), tax: Number(form.tax) });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-500 text-sm">Manage your menu items</p>
          </div>
          <Button onClick={() => openModal()} className="shrink-0"><Plus size={18} /> Add Product</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input-field sm:w-48 shrink-0" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            {!categoriesLoading && !categories?.length && (
              <option value="" disabled>No categories — create one first</option>
            )}
          </select>
        </div>

        {isLoading ? <LoadingSpinner className="h-40" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products?.map((product) => (
              <div key={product._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <span className="badge mt-1" style={{ backgroundColor: `${product.category?.color}20`, color: product.category?.color }}>
                      {product.category?.name}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
                </div>
                {product.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{product.unit} · Tax {product.tax}%</span>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(product)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil size={14} /></button>
                    <button onClick={() => deleteMutation.mutate(product._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Product' : 'Add Product'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required disabled={!categories?.length}>
                <option value="">{categories?.length ? 'Select category' : 'No categories available'}</option>
                {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              {!categoriesLoading && !categories?.length && (
                <p className="text-xs text-amber-600 mt-1.5">
                  No categories found.{' '}
                  <Link to="/categories" className="underline font-medium">Create a category</Link> first.
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              <Input label="Tax %" type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} />
            </div>
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
              <Button type="submit" loading={saveMutation.isPending}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Products;
