import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings as SettingsIcon, CreditCard, Banknote, QrCode, Save, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { settingsAPI } from '../services/endpoints';

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const [cashEnabled, setCashEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(true);
  const [upiEnabled, setUpiEnabled] = useState(true);
  const [upiId, setUpiId] = useState('');

  // Fetch current settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get().then((r) => r.data.data),
  });

  // Populate state on load
  useEffect(() => {
    if (settingsData) {
      setCashEnabled(settingsData.paymentMethods?.cash ?? true);
      setCardEnabled(settingsData.paymentMethods?.card ?? true);
      setUpiEnabled(settingsData.paymentMethods?.upi ?? true);
      setUpiId(settingsData.upiId || '');
    }
  }, [settingsData]);

  // Mutation to update settings
  const updateSettingsMutation = useMutation({
    mutationFn: (data) => settingsAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    },
  });

  const handleSave = (e) => {
    e.preventDefault();

    // Validations
    if (upiEnabled && !upiId.trim()) {
      toast.error('UPI ID is required when UPI payments are enabled.');
      return;
    }

    if (upiEnabled && !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. merchant@ybl).');
      return;
    }

    // Ensure at least one payment method is enabled
    if (!cashEnabled && !cardEnabled && !upiEnabled) {
      toast.error('At least one payment method must be enabled.');
      return;
    }

    const payload = {
      paymentMethods: {
        cash: cashEnabled,
        card: cardEnabled,
        upi: upiEnabled,
      },
      upiId: upiId.trim(),
    };

    updateSettingsMutation.mutate(payload);
  };

  if (isLoading) {
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
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <SettingsIcon className="text-primary" /> Store Settings
          </h1>
          <p className="text-gray-500 text-sm">Configure checkout payment methods and store-wide properties.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Payment Settings Card */}
          <div className="card space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary" />
            
            <div>
              <h2 className="text-lg font-bold text-gray-800">Payment Setup</h2>
              <p className="text-gray-500 text-xs mt-0.5">Enable/disable payment methods at checkout and configure QR merchant links.</p>
            </div>

            <div className="space-y-4">
              {/* Cash Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Cash Payments</h3>
                    <p className="text-xs text-gray-500">Allows checkout using cash payments and calculates changes.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cashEnabled}
                    onChange={(e) => setCashEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Card Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Digital / Card Payments</h3>
                    <p className="text-xs text-gray-500">Represents bank cards, terminals, and external machine settlements.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardEnabled}
                    onChange={(e) => setCardEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* UPI Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <QrCode size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">UPI QR Payments</h3>
                    <p className="text-xs text-gray-500">Generates instant dynamic payment QR codes using your merchant ID.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={upiEnabled}
                    onChange={(e) => setUpiEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>

            {/* UPI Config Form */}
            {upiEnabled && (
              <div className="pt-4 border-t border-gray-100 space-y-3 animate-fade-in">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Merchant UPI ID
                  </label>
                  <input
                    type="text"
                    className="input-field max-w-md"
                    placeholder="e.g. cafevibes@ybl"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-gray-400">
                    Entering a valid merchant identifier generates custom QR codes matching your store account.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Alert block if no method is checked */}
          {!cashEnabled && !cardEnabled && !upiEnabled && (
            <div className="flex gap-2 items-center bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-sm font-medium">
              <ShieldAlert size={18} />
              At least one payment method must remain active to allow POS checkout!
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={updateSettingsMutation.isPending}
              className="flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Save size={16} /> Save Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
