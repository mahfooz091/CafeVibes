import express from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { customerValidation } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCustomers)
  .post(customerValidation, validate, createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(customerValidation, validate, updateCustomer)
  .delete(deleteCustomer);

export default router;
