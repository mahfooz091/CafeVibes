import React, { useState } from 'react';

const Settings = () => {
  const [cafeName, setCafeName] = useState('CafeVibes');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('8');
  const [serviceCharge, setServiceCharge] = useState('5');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for choosing CafeVibes!');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert('Cafe Settings saved successfully!');
  };

  return (
    <div className="page-container settings-page">
      <form onSubmit={handleSaveSettings} className="settings-form">
        <div className="settings-section">
          <h3>Store Configurations</h3>
          <div className="form-group">
            <label>Cafe Name</label>
            <input type="text" value={cafeName} onChange={(e) => setCafeName(e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Default Tax Rate (%)</label>
              <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Billing & Receipts</h3>
          <div className="form-group">
            <label>Service Charge (%)</label>
            <input type="number" value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Receipt Footer Message</label>
            <textarea value={receiptFooter} onChange={(e) => setReceiptFooter(e.target.value)} rows={3}></textarea>
          </div>
        </div>

        <button type="submit" className="save-settings-btn">Save Configurations</button>
      </form>
    </div>
  );
};

export default Settings;
