import QRCode from 'qrcode';

export const generatePaymentQR = async (amount, orderNumber, upiId) => {
  const merchantUpi = upiId || 'cafevibes@upi';
  const upiString = `upi://pay?pa=${merchantUpi}&pn=CafeVibes&am=${amount}&cu=INR&tn=Order%20${orderNumber}`;
  return QRCode.toDataURL(upiString, {
    width: 300,
    margin: 2,
    color: { dark: '#0F766E', light: '#FFFFFF' },
  });
};
