import express from 'express';
import {
  getDashboardStats, getSalesTrend, getTopProducts, getTopCategories,
  getTopOrders, exportExcel, exportPDF, getReportEmployees, getReportSessions,
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/sales-trend', getSalesTrend);
router.get('/top-products', getTopProducts);
router.get('/top-categories', getTopCategories);
router.get('/top-orders', getTopOrders);
router.get('/employees', getReportEmployees);
router.get('/sessions', getReportSessions);
router.get('/export/excel', exportExcel);
router.get('/export/pdf', exportPDF);

export default router;
