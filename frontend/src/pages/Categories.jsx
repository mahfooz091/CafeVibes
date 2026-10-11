import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { categoryAPI } from '../services/endpoints';

const Categories = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', color: '#0F766E' });
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? categoryAPI.update(editing, data) : categoryAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(editing ? 'Category updated' : 'Category created');
      setModalOpen(false);
      setEditing(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
    },
  });

  const openModal = (cat = null) => {
    if (cat) { setEditing(cat._id); setForm({ name: cat.name, color: cat.color }); }
    else { setEditing(null); setForm({ name: '', color: '#0F766E' }); }
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-500 text-sm">Organize your menu with color-coded categories</p>
          </div>
          <Button onClick={() => openModal()} className="shrink-0"><Plus size={18} /> Add Category</Button>
        </div>

        {isLoading ? <LoadingSpinner className="h-40" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories?.map((cat) => (
              <div key={cat._id} className="card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{cat.name}</h3>
                  <p className="text-xs text-gray-400">{cat.color}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => deleteMutation.mutate(cat._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer" />
                <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={saveMutation.isPending}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Categories;
