import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontPath = path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf');

export const generateExcelReport = async (orders) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CafeVibes';
  const sheet = workbook.addWorksheet('Sales Report');

  sheet.columns = [
    { header: 'Order #', key: 'orderNumber', width: 15 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Customer', key: 'customer', width: 20 },
    { header: 'Items', key: 'items', width: 10 },
    { header: 'Subtotal', key: 'subtotal', width: 12 },
    { header: 'Tax', key: 'tax', width: 10 },
    { header: 'Discount', key: 'discount', width: 10 },
    { header: 'Total', key: 'total', width: 12 },
    { header: 'Payment', key: 'payment', width: 10 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };

  orders.forEach((order) => {
    sheet.addRow({
      orderNumber: order.orderNumber,
      date: order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A',
      customer: order.customer?.name || 'Walk-in',
      items: order.items.length,
      subtotal: order.subtotal,
      tax: order.taxAmount,
      discount: order.discount,
      total: order.total,
      payment: order.payment?.method || 'N/A',
    });
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  sheet.addRow({});
  const summaryRow = sheet.addRow({ orderNumber: 'TOTAL', total: totalRevenue });
  summaryRow.font = { bold: true };

  return workbook.xlsx.writeBuffer();
};

export const generatePDFReport = (orders, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Register Roboto font to support ₹ symbol and other Unicode characters
  if (fs.existsSync(fontPath)) {
    doc.registerFont('Roboto', fontPath);
    doc.font('Roboto');
  }

  doc.pipe(res);

  doc.fontSize(22).fillColor('#0F766E').text('CafeVibes Sales Report', { align: 'center' });
  doc.fontSize(10).fillColor('#666').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(2);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  doc.fontSize(12).fillColor('#333');
  doc.text(`Total Orders: ${orders.length}`);
  doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`);
  doc.moveDown();

  doc.fontSize(10);
  orders.slice(0, 50).forEach((order) => {
    doc.text(
      `${order.orderNumber} | ${order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'} | ${order.customer?.name || 'Walk-in'} | ₹${order.total.toFixed(2)}`
    );
  });

  doc.end();
};
