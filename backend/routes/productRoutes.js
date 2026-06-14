import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { productValidation } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProducts)
  .post(authorize('admin'), productValidation, validate, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(authorize('admin'), productValidation, validate, updateProduct)
  .delete(authorize('admin'), deleteProduct);

export default router;
