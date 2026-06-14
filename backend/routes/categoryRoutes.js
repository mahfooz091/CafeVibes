import express from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { categoryValidation } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCategories)
  .post(authorize('admin'), categoryValidation, validate, createCategory);

router.route('/:id')
  .get(getCategory)
  .put(authorize('admin'), categoryValidation, validate, updateCategory)
  .delete(authorize('admin'), deleteCategory);

export default router;
