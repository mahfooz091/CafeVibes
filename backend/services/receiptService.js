import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontPath = path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf');

const formatCurrencyHTML = (amount) => `₹${amount.toFixed(2)}`;
const formatCurrencyPDF = (amount) => `₹${amount.toFixed(2)}`;

export const generateReceiptHTML = (order) => {
  const itemsHTML = order.items
    .map(
      (item) =>
        `<tr>
          <td>${item.name} x${item.quantity}</td>
          <td style="text-align:right">${formatCurrencyHTML(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head><title>Receipt ${order.orderNumber}</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; color: #333; }
  .header { text-align: center; border-bottom: 2px solid #0F766E; padding-bottom: 15px; margin-bottom: 15px; }
  .header h1 { color: #0F766E; margin: 0; }
  .header p { color: #6F4E37; margin: 5px 0; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; border-bottom: 1px solid #eee; }
  .totals td { border: none; font-weight: 600; }
  .total-row { color: #0F766E; font-size: 1.2em; }
  .footer { text-align: center; margin-top: 20px; color: #888; font-size: 0.85em; }
</style>
</head>
<body>
  <div class="header">
    <h1>CafeVibes</h1>
    <p>The Digital Heartbeat of Your Cafe</p>
    <p>Order: ${order.orderNumber}</p>
    <p>${new Date(order.paidAt || order.createdAt).toLocaleString()}</p>
  </div>
  ${order.customer ? `<p><strong>Customer:</strong> ${order.customer.name}</p>` : ''}
  <table>${itemsHTML}</table>
  <table class="totals" style="margin-top:15px">
    <tr><td>Subtotal</td><td style="text-align:right">${formatCurrencyHTML(order.subtotal)}</td></tr>
    <tr><td>Tax</td><td style="text-align:right">${formatCurrencyHTML(order.taxAmount)}</td></tr>
    ${order.discount > 0 ? `<tr><td>Discount</td><td style="text-align:right">-${formatCurrencyHTML(order.discount)}</td></tr>` : ''}
    <tr class="total-row"><td>Total</td><td style="text-align:right">${formatCurrencyHTML(order.total)}</td></tr>
  </table>
  ${order.payment ? `<p style="margin-top:15px"><strong>Payment:</strong> ${order.payment.method.toUpperCase()}</p>` : ''}
  <div class="footer"><p>Thank you for visiting CafeVibes!</p></div>
</body>
</html>`;
};

export const generateReceiptPDF = (order, res) => {
  const doc = new PDFDocument({ size: [226, 600], margin: 20 });
  
  // Register Roboto font to support ₹ symbol and other Unicode characters
  if (fs.existsSync(fontPath)) {
    doc.registerFont('Roboto', fontPath);
    doc.font('Roboto');
  }

  doc.pipe(res);

  doc.fontSize(16).fillColor('#0F766E').text('CafeVibes', { align: 'center' });
  doc.fontSize(8).fillColor('#6F4E37').text('The Digital Heartbeat of Your Cafe', { align: 'center' });
  doc.moveDown();
  doc.fontSize(9).fillColor('#333').text(`Order: ${order.orderNumber}`);
  doc.text(`Date: ${new Date(order.paidAt || order.createdAt).toLocaleString()}`);
  if (order.customer?.name) doc.text(`Customer: ${order.customer.name}`);
  doc.moveDown();

  doc.strokeColor('#0F766E').moveTo(20, doc.y).lineTo(206, doc.y).stroke();
  doc.moveDown(0.5);

  order.items.forEach((item) => {
    doc.fontSize(9).text(`${item.name} x${item.quantity}`, { continued: true });
    doc.text(formatCurrencyPDF(item.price * item.quantity), { align: 'right' });
  });

  doc.moveDown();
  doc.strokeColor('#eee').moveTo(20, doc.y).lineTo(206, doc.y).stroke();
  doc.moveDown(0.5);

  const addTotalLine = (label, value) => {
    doc.fontSize(9).text(label, { continued: true });
    doc.text(value, { align: 'right' });
  };

  addTotalLine('Subtotal:', formatCurrencyPDF(order.subtotal));
  addTotalLine('Tax:', formatCurrencyPDF(order.taxAmount));
  if (order.discount > 0) addTotalLine('Discount:', `-${formatCurrencyPDF(order.discount)}`);
  doc.fontSize(11).fillColor('#0F766E');
  addTotalLine('Total:', formatCurrencyPDF(order.total));

  if (order.payment) {
    doc.moveDown();
    doc.fontSize(9).fillColor('#333').text(`Payment: ${order.payment.method.toUpperCase()}`);
  }

  doc.moveDown(2);
  doc.fontSize(8).fillColor('#888').text('Thank you for visiting CafeVibes!', { align: 'center' });
  doc.end();
};

export const sendReceiptEmail = async (email, order) => {
  let transporter;
  let fromAddress = process.env.SMTP_FROM || 'no-reply@cafevibes.com';

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Gmail config using user's variables
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    fromAddress = `"CafeVibes" <${process.env.EMAIL_USER}>`;
  } else {
    // Fallback: Create ethereal test account for development
    console.log('No SMTP config found in .env. Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    fromAddress = '"CafeVibes Test" <no-reply@cafevibes.com>';
  }

  const html = generateReceiptHTML(order);

  const info = await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: `CafeVibes Receipt - ${order.orderNumber}`,
    html,
  });

  if (!process.env.SMTP_HOST) {
    console.log('Preview URL for mock email:', nodemailer.getTestMessageUrl(info));
  }
};
