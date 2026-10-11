import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Key, Archive, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { usersAPI } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  
  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({ name: '', email: '', role: 'employee', password: '' });
  const [passwordForm, setPasswordForm] = useState({ userId: '', name: '', password: '' });
  const [deletingUser, setDeletingUser] = useState(null);

  // Fetch all accounts
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll().then((r) => r.data.data),
  });

  // Create account mutation
  const createMutation = useMutation({
    mutationFn: (data) => usersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Employee account created successfully!');
      setCreateModalOpen(false);
      setCreateForm({ name: '', email: '', role: 'employee', password: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create user');
    },
  });

  // Change password mutation
  const passwordMutation = useMutation({
    mutationFn: ({ id, password }) => usersAPI.changePassword(id, password),
    onSuccess: () => {
      toast.success('Password updated successfully!');
      setPasswordModalOpen(false);
      setPasswordForm({ userId: '', name: '', password: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to change password');
    },
  });

  // Archive (deactivate) mutation
  const archiveMutation = useMutation({
    mutationFn: (id) => usersAPI.toggleArchive(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      const statusMsg = res.data.data.isActive ? 'activated' : 'archived';
      toast.success(`Account successfully ${statusMsg}!`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Action failed');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted permanently');
      setDeleteConfirmOpen(false);
      setDeletingUser(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    },
  });

  // Filters accounts list by name or email search
  const filteredUsers = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-500 text-sm">List, configure, archive, and manage cashier and admin accounts.</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)} className="shrink-0">
            <Plus size={18} /> Add Employee
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-10"
            placeholder="Search employees by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User list */}
        {isLoading ? (
          <LoadingSpinner className="h-40" />
        ) : (
          <div className="card overflow-x-auto relative">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-medium pb-3 text-xs uppercase">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      No accounts found matching your query
                    </td>
                  </tr>
                ) : (
                  filteredUsers?.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 font-semibold text-gray-800">{u.name}</td>
                      <td className="py-3.5 text-gray-500">{u.email}</td>
                      <td className="py-3.5">
                        <Badge
                          variant={u.role === 'admin' ? 'success' : 'warning'}
                          className="capitalize"
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            u.isActive
                              ? 'bg-green-50 text-green-700 border border-green-100'
                              : 'bg-red-50 text-red-700 border border-red-100'
                          }`}
                        >
                          {u.isActive ? (
                            <>
                              <CheckCircle size={12} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Archived
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* Change Password */}
                          <button
                            onClick={() =>
                              setPasswordForm({ userId: u._id, name: u.name, password: '' }) ||
                              setPasswordModalOpen(true)
                            }
                            title="Change Password"
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"
                          >
                            <Key size={14} />
                          </button>

                          {/* Archive toggle */}
                          <button
                            onClick={() => archiveMutation.mutate(u._id)}
                            title={u.isActive ? 'Archive (Deactivate)' : 'Activate Account'}
                            disabled={u._id === currentUser?.id}
                            className={`p-2 rounded-lg transition-colors ${
                              u._id === currentUser?.id
                                ? 'opacity-30 cursor-not-allowed text-gray-300'
                                : u.isActive
                                ? 'hover:bg-amber-50 text-amber-500 hover:text-amber-700'
                                : 'hover:bg-green-50 text-green-500 hover:text-green-700'
                            }`}
                          >
                            <Archive size={14} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingUser(u) || setDeleteConfirmOpen(true)}
                            title="Delete Permanently"
                            disabled={u._id === currentUser?.id}
                            className={`p-2 rounded-lg transition-colors ${
                              u._id === currentUser?.id
                                ? 'opacity-30 cursor-not-allowed text-gray-300'
                                : 'hover:bg-red-50 text-red-500 hover:text-red-700'
                            }`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Create User */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Add New Employee"
          size="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate(createForm);
            }}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="Jane Cashier"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              placeholder="jane@cafevibes.com"
              required
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                System Role
              </label>
              <select
                className="input-field !py-2.5 text-sm"
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
              >
                <option value="employee">Employee / Cashier</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            <Input
              label="Default Password"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              placeholder="Min. 6 characters"
              required
            />

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={createMutation.isPending}>
                Create Employee
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Change Password */}
        <Modal
          isOpen={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          title={`Reset Password for ${passwordForm.name}`}
          size="sm"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              passwordMutation.mutate({ id: passwordForm.userId, password: passwordForm.password });
            }}
            className="space-y-4"
          >
            <Input
              label="New Password"
              type="password"
              value={passwordForm.password}
              onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
              placeholder="Min. 6 characters"
              required
            />

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setPasswordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={passwordMutation.isPending}>
                Reset Password
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Delete Confirmation */}
        <Modal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          title="Delete Account"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
              <ShieldAlert className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Warning!</p>
                <p className="text-xs text-red-600 mt-1">
                  You are about to permanently delete the account for <strong>{deletingUser?.name}</strong>. This action is irreversible. All related logs, checkouts, and sessions history will remain, but the profile will be destroyed.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Are you sure you want to proceed with deleting this account?
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deletingUser?._id)}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Users;
