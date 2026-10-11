import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2, Layers, MapPin, Settings, Check, X, AlertCircle, CreditCard, Clock, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { floorAPI } from '../services/endpoints';
import { getStatusColor, formatCurrency, sortTablesFloorAndRowWise } from '../utils/helpers';

const FloorsTables = () => {
  const [activeFloorId, setActiveFloorId] = useState('all'); // 'all' means show all floors
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [floorModal, setFloorModal] = useState(false);
  const [editFloorModal, setEditFloorModal] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [editTableModal, setEditTableModal] = useState(false);

  // Forms state
  const [floorForm, setFloorForm] = useState({ name: '', description: '' });
  const [editFloorForm, setEditFloorForm] = useState({ name: '', description: '' });
  const [tableForm, setTableForm] = useState({ name: '', floor: '', seatCount: 4, shape: 'square', status: 'available', isActive: true, reservationTime: '' });
  const [editTableForm, setEditTableForm] = useState({ name: '', floor: '', seatCount: 4, shape: 'square', status: 'available', isActive: true, reservationTime: '' });

  // Selected items for editing
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);

  const queryClient = useQueryClient();

  // Queries
  const { data: floors, isLoading: floorsLoading } = useQuery({
    queryKey: ['floors'],
    queryFn: () => floorAPI.getFloors().then((r) => r.data.data),
  });

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: () => floorAPI.getTables().then((r) => r.data.data),
  });

  // Mutations
  const createFloor = useMutation({
    mutationFn: (data) => floorAPI.createFloor(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      setFloorModal(false);
      setFloorForm({ name: '', description: '' });
      toast.success('Floor created successfully!');
      if (res.data?.data?._id) {
        setActiveFloorId(res.data.data._id);
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create floor'),
  });

  const updateFloor = useMutation({
    mutationFn: ({ id, data }) => floorAPI.updateFloor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      setEditFloorModal(false);
      setSelectedFloor(null);
      toast.success('Floor updated successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update floor'),
  });

  const deleteFloor = useMutation({
    mutationFn: (id) => floorAPI.deleteFloor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      setEditFloorModal(false);
      setSelectedFloor(null);
      setActiveFloorId('all');
      toast.success('Floor deleted successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Cannot delete floor with existing tables'),
  });

  const createTable = useMutation({
    mutationFn: (data) => floorAPI.createTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      setTableModal(false);
      setTableForm({ name: '', floor: activeFloorId !== 'all' ? activeFloorId : '', seatCount: 4, shape: 'square', status: 'available', isActive: true, reservationTime: '' });
      toast.success('Table created successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create table'),
  });

  const updateTable = useMutation({
    mutationFn: ({ id, data }) => floorAPI.updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      setEditTableModal(false);
      setSelectedTable(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update table'),
  });

  const deleteTable = useMutation({
    mutationFn: (id) => floorAPI.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      setEditTableModal(false);
      setSelectedTable(null);
      toast.success('Table deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete table'),
  });

  // Filter tables based on active floor, search, and status filters
  const filteredTables = sortTablesFloorAndRowWise(
    tables?.filter((table) => {
      const matchesFloor = activeFloorId === 'all' || table.floor?._id === activeFloorId || table.floor === activeFloorId;
      const matchesSearch = table.name.toLowerCase().includes(search.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'available') matchesStatus = table.status === 'available' && table.isActive !== false;
      else if (statusFilter === 'occupied') matchesStatus = table.status === 'occupied' && table.isActive !== false;
      else if (statusFilter === 'reserved') matchesStatus = table.status === 'reserved' && table.isActive !== false;
      else if (statusFilter === 'disabled') matchesStatus = table.status === 'disabled' || table.isActive === false;

      return matchesFloor && matchesSearch && matchesStatus;
    })
  );

  // Statistics Calculations (based on active floor filter)
  const statsTables = tables?.filter((t) => activeFloorId === 'all' || t.floor?._id === activeFloorId || t.floor === activeFloorId) || [];
  
  const stats = {
    total: statsTables.length,
    available: statsTables.filter((t) => t.status === 'available' && t.isActive !== false).length,
    occupied: statsTables.filter((t) => t.status === 'occupied' && t.isActive !== false).length,
    reserved: statsTables.filter((t) => t.status === 'reserved' && t.isActive !== false).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Floor & Table Management</h1>
            <p className="text-gray-500 text-sm mt-1">Operational view of seating metrics, running tables, and reservations.</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setFloorModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-755 font-bold shadow-sm transition-all"
            >
              <Plus size={16} /> Add Floor
            </Button>
            <Button
              onClick={() => {
                setTableForm({ ...tableForm, floor: activeFloorId !== 'all' ? activeFloorId : '' });
                setTableModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
            >
              <Plus size={16} /> Add Table
            </Button>
          </div>
        </div>

        {/* Floor Selection Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFloorId('all')}
              className={`px-4 py-2 rounded-full text-xs font-extrabold tracking-wide uppercase transition-all duration-200 ${
                activeFloorId === 'all'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white border border-gray-200 text-gray-650 hover:bg-gray-50'
              }`}
            >
              All Floors
            </button>
            {floors?.map((floor) => {
              const isSelected = activeFloorId === floor._id;
              return (
                <button
                  key={floor._id}
                  onClick={() => setActiveFloorId(floor._id)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold tracking-wide uppercase transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/10'
                      : 'bg-white border border-gray-200 text-gray-650 hover:bg-gray-50'
                  }`}
                >
                  {floor.name}
                </button>
              );
            })}
          </div>

          {activeFloorId !== 'all' && (
            <button
              onClick={() => {
                const currentFloor = floors?.find((f) => f._id === activeFloorId);
                if (currentFloor) {
                  setSelectedFloor(currentFloor);
                  setEditFloorForm({
                    name: currentFloor.name,
                    description: currentFloor.description || '',
                  });
                  setEditFloorModal(true);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-800 transition-colors text-xs font-bold"
              title="Edit Floor settings"
            >
              <Settings size={14} />
              <span>Configure Floor</span>
            </button>
          )}
        </div>

        {floorsLoading || tablesLoading ? (
          <div className="h-80 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Linear-style Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Tables', count: stats.total, color: 'text-gray-900 border-gray-100', dot: 'bg-blue-500' },
                { label: 'Available', count: stats.available, color: 'text-emerald-700 border-emerald-100 bg-emerald-50/10', dot: 'bg-emerald-500' },
                { label: 'Occupied', count: stats.occupied, color: 'text-rose-700 border-rose-100 bg-rose-50/10', dot: 'bg-rose-500' },
                { label: 'Reserved', count: stats.reserved, color: 'text-amber-700 border-amber-100 bg-amber-50/10', dot: 'bg-amber-500' },
              ].map((m, i) => (
                <div key={i} className={`bg-white border p-6 rounded-[24px] shadow-sm relative overflow-hidden flex flex-col justify-between h-28 ${m.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold opacity-70 uppercase tracking-wider block">{m.label}</span>
                    <span className={`w-2 h-2 rounded-full ${m.dot} shadow-sm animate-pulse`} />
                  </div>
                  <span className="text-3xl font-extrabold leading-none tracking-tight">{m.count}</span>
                </div>
              ))}
            </div>

            {/* Grid Search & Filters Dashboard Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-gray-100 p-4 rounded-[24px] shadow-sm">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10 text-xs py-2 rounded-xl border-gray-200"
                  placeholder="Search table by name or number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-400 font-semibold shrink-0">Filter Status:</span>
                <select
                  className="input-field text-xs py-1.5 rounded-xl border-gray-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Tables</option>
                  <option value="available">Available (Green)</option>
                  <option value="occupied">Occupied (Red)</option>
                  <option value="reserved">Reserved (Yellow)</option>
                  <option value="disabled">Inactive / Disabled (Slate)</option>
                </select>
              </div>
            </div>

            {/* Premium Table Card Grid */}
            <div className="min-h-[400px]">
              {filteredTables.length === 0 ? (
                <div className="h-80 flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 rounded-[24px] shadow-sm">
                  <Layers className="w-12 h-12 text-gray-300 mb-3 animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-800">No matching tables</h3>
                  <p className="text-gray-400 text-xs max-w-sm mt-1">Please try modifying your filter or create new tables.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  <AnimatePresence>
                    {filteredTables.map((table) => {
                      const isOccupied = table.status === 'occupied';
                      const isReserved = table.status === 'reserved';
                      const isDisabled = table.status === 'disabled' || table.isActive === false;

                      // Glow indicator color bases
                      let glowBorder = 'hover:ring-primary/20';
                      let topGlowBar = 'bg-emerald-500';
                      let statusBadgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';

                      if (isDisabled) {
                        glowBorder = 'opacity-60 border-slate-200 bg-slate-50/50';
                        topGlowBar = 'bg-slate-350';
                        statusBadgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
                      } else if (isOccupied) {
                        glowBorder = 'ring-1 ring-rose-100 hover:ring-2 hover:ring-rose-300';
                        topGlowBar = 'bg-rose-500';
                        statusBadgeStyle = 'bg-rose-50/80 text-rose-700 border-rose-100';
                      } else if (isReserved) {
                        glowBorder = 'ring-1 ring-amber-100 hover:ring-2 hover:ring-amber-300';
                        topGlowBar = 'bg-amber-500';
                        statusBadgeStyle = 'bg-amber-50/80 text-amber-700 border-amber-100';
                      }

                      return (
                        <motion.div
                          key={table._id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => {
                            setSelectedTable(table);
                            setEditTableForm({
                              name: table.name,
                              floor: table.floor?._id || table.floor,
                              seatCount: table.seatCount,
                              shape: table.shape || 'square',
                              status: table.status || 'available',
                              isActive: table.isActive !== false,
                              reservationTime: table.reservationTime || '',
                            });
                            setEditTableModal(true);
                          }}
                          className={`cursor-pointer bg-white border border-gray-100/80 shadow-sm hover:shadow-md rounded-[24px] p-5 flex flex-col justify-between h-48 relative overflow-hidden group transition-all duration-200 ${glowBorder}`}
                        >
                          {/* Accent bar */}
                          <div className={`absolute top-0 left-0 right-0 h-1.5 ${topGlowBar}`} />

                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-black text-gray-800 tracking-tight">{table.name}</h3>
                              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide mt-0.5">{table.floor?.name || 'No Floor'}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border ${statusBadgeStyle}`}>
                              {table.isActive ? table.status : 'Inactive'}
                            </span>
                          </div>

                          {/* Seating operational stats */}
                          <div className="my-2.5 space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400 font-semibold">Capacity</span>
                              <span className="font-extrabold text-gray-700">{table.seatCount} Seats</span>
                            </div>

                            {isOccupied && (
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-semibold flex items-center gap-1"><CreditCard size={12} className="text-rose-500" /> Bill</span>
                                <span className="font-black text-rose-600">
                                  {table.currentOrder?.total ? formatCurrency(table.currentOrder.total) : '₹0.00'}
                                </span>
                              </div>
                            )}

                            {isReserved && (
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-semibold flex items-center gap-1"><Clock size={12} className="text-amber-500" /> Res. Time</span>
                                <span className="font-extrabold text-amber-600">
                                  {table.reservationTime || 'Pending'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Bottom action controls */}
                          <div className="flex items-center justify-between border-t border-gray-50 pt-2.5 mt-auto">
                            <div className="flex gap-1.5">
                              {['available', 'occupied', 'reserved'].map((s) => (
                                <button
                                  key={s}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTable.mutate({ id: table._id, data: { status: s } });
                                    toast.success(`${table.name} is now ${s}`);
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-[8.5px] font-extrabold uppercase tracking-wider transition-colors ${
                                    table.status === s
                                      ? s === 'occupied'
                                        ? 'bg-rose-100 text-rose-800'
                                        : s === 'reserved'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                      : 'bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                                  }`}
                                >
                                  {s.slice(0, 3)}
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete ${table.name}?`)) {
                                  deleteTable.mutate(table._id);
                                }
                              }}
                              className="p-1 hover:bg-red-50 text-gray-200 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Table"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </>
        )}

        {/* MODAL: Add Floor */}
        <Modal isOpen={floorModal} onClose={() => setFloorModal(false)} title="Create New Floor">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createFloor.mutate(floorForm);
            }}
            className="space-y-4"
          >
            <Input
              label="Floor Name *"
              value={floorForm.name}
              onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
              placeholder="e.g. Ground Floor, Rooftop"
              required
            />
            <Input
              label="Description (Optional)"
              value={floorForm.description}
              onChange={(e) => setFloorForm({ ...floorForm, description: e.target.value })}
              placeholder="e.g. Patio seating, Main dining hall"
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setFloorModal(false)}>Cancel</Button>
              <Button type="submit" loading={createFloor.isPending}>Save Floor</Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: Edit Floor */}
        <Modal isOpen={editFloorModal} onClose={() => setEditFloorModal(false)} title="Configure Floor">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedFloor) {
                updateFloor.mutate({ id: selectedFloor._id, data: editFloorForm });
              }
            }}
            className="space-y-4"
          >
            <Input
              label="Floor Name *"
              value={editFloorForm.name}
              onChange={(e) => setEditFloorForm({ ...editFloorForm, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={editFloorForm.description}
              onChange={(e) => setEditFloorForm({ ...editFloorForm, description: e.target.value })}
            />
            
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                disabled={deleteFloor.isPending}
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ${selectedFloor?.name}? All associated tables will need to be reallocated.`)) {
                    deleteFloor.mutate(selectedFloor._id);
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
              >
                Delete Floor
              </button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditFloorModal(false)}>Cancel</Button>
                <Button type="submit" loading={updateFloor.isPending}>Update Floor</Button>
              </div>
            </div>
          </form>
        </Modal>

        {/* MODAL: Add Table */}
        <Modal isOpen={tableModal} onClose={() => setTableModal(false)} title="Create New Table">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createTable.mutate({
                ...tableForm,
                seatCount: Number(tableForm.seatCount),
              });
            }}
            className="space-y-4"
          >
            <Input
              label="Table Number / Name *"
              value={tableForm.name}
              onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })}
              placeholder="e.g. Table 1, Bar 2"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Floor *</label>
              <select
                className="input-field text-sm"
                value={tableForm.floor}
                onChange={(e) => setTableForm({ ...tableForm, floor: e.target.value })}
                required
              >
                <option value="">Select floor</option>
                {floors?.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>

            <Input
              label="Seat Capacity *"
              type="number"
              value={tableForm.seatCount}
              onChange={(e) => setTableForm({ ...tableForm, seatCount: Number(e.target.value) })}
              min={1}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  className="input-field text-sm"
                  value={tableForm.status}
                  onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}
                >
                  <option value="available">Available (Green)</option>
                  <option value="occupied">Occupied (Red)</option>
                  <option value="reserved">Reserved (Yellow)</option>
                  <option value="disabled">Disabled (Gray)</option>
                </select>
              </div>

              <div>
                <Input
                  label="Reservation Time"
                  value={tableForm.reservationTime}
                  onChange={(e) => setTableForm({ ...tableForm, reservationTime: e.target.value })}
                  placeholder="e.g. 7:30 PM (optional)"
                  disabled={tableForm.status !== 'reserved'}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setTableModal(false)}>Cancel</Button>
              <Button type="submit" loading={createTable.isPending}>Add Table</Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: Edit Table */}
        <Modal isOpen={editTableModal} onClose={() => setEditTableModal(false)} title={`Configure: ${selectedTable?.name}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedTable) {
                updateTable.mutate({
                  id: selectedTable._id,
                  data: {
                    name: editTableForm.name,
                    floor: editTableForm.floor,
                    seatCount: Number(editTableForm.seatCount),
                    shape: editTableForm.shape,
                    status: editTableForm.status,
                    isActive: editTableForm.isActive,
                    reservationTime: editTableForm.status === 'reserved' ? editTableForm.reservationTime : null,
                  },
                });
                toast.success('Table details updated!');
              }
            }}
            className="space-y-4"
          >
            <Input
              label="Table Name / Number *"
              value={editTableForm.name}
              onChange={(e) => setEditTableForm({ ...editTableForm, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Reallocate Floor *</label>
              <select
                className="input-field text-sm"
                value={editTableForm.floor}
                onChange={(e) => setEditTableForm({ ...editTableForm, floor: e.target.value })}
                required
              >
                {floors?.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>

            <Input
              label="Seat Capacity *"
              type="number"
              value={editTableForm.seatCount}
              onChange={(e) => setEditTableForm({ ...editTableForm, seatCount: Number(e.target.value) })}
              min={1}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  className="input-field text-sm"
                  value={editTableForm.status}
                  onChange={(e) => setEditTableForm({ ...editTableForm, status: e.target.value })}
                >
                  <option value="available">Available (Green)</option>
                  <option value="occupied">Occupied (Red)</option>
                  <option value="reserved">Reserved (Yellow)</option>
                  <option value="disabled">Disabled (Gray)</option>
                </select>
              </div>

              <div>
                <Input
                  label="Reservation Time"
                  value={editTableForm.reservationTime}
                  onChange={(e) => setEditTableForm({ ...editTableForm, reservationTime: e.target.value })}
                  placeholder="e.g. 8:00 PM"
                  disabled={editTableForm.status !== 'reserved'}
                />
              </div>
            </div>

            {/* Active Status Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-150">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-gray-800 block">Table Active Status</span>
                <span className="text-[10px] text-gray-400 block">Inactive tables are set to Slate grey status and hidden from POS selectors.</span>
              </div>
              <button
                type="button"
                onClick={() => setEditTableForm({ ...editTableForm, isActive: !editTableForm.isActive })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  editTableForm.isActive ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    editTableForm.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Delete button */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                disabled={deleteTable.isPending}
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ${selectedTable?.name}? This action is permanent.`)) {
                    deleteTable.mutate(selectedTable._id);
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
              >
                Delete Table
              </button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditTableModal(false)}>Cancel</Button>
                <Button type="submit" loading={updateTable.isPending}>Save Settings</Button>
              </div>
            </div>
          </form>
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default FloorsTables;
