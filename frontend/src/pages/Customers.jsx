import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { customerAPI } from '../services/endpoints';
import { formatCurrency } from '../utils/helpers';

const Customers = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' });
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', search],
    queryFn: () => customerAPI.getAll({ search: search || undefined }).then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? customerAPI.update(editing, data) : customerAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(editing ? 'Customer updated' : 'Customer created');
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => customerAPI.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); toast.success('Deleted'); },
  });

  const openModal = (c = null) => {
    if (c) { setEditing(c._id); setForm({ name: c.name, email: c.email || '', phone: c.phone || '', address: c.address || '', notes: c.notes || '' }); }
    else { setEditing(null); setForm({ name: '', email: '', phone: '', address: '', notes: '' }); }
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <p className="text-gray-500 text-sm">Manage customer profiles</p>
          </div>
          <Button onClick={() => openModal()} className="shrink-0"><Plus size={18} /> Add Customer</Button>
        </div>

        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-10" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {isLoading ? <LoadingSpinner className="h-40" /> : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Orders</th>
                  <th className="pb-3 font-medium">Spent</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3 text-gray-500">{c.email || c.phone || '-'}</td>
                    <td className="py-3">{c.totalOrders}</td>
                    <td className="py-3">{formatCurrency(c.totalSpent)}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openModal(c)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil size={14} /></button>
                        <button onClick={() => deleteMutation.mutate(c._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Customer' : 'Add Customer'}>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={saveMutation.isPending}>Save</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
