import { body } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('tax').optional().isFloat({ min: 0, max: 100 }),
];

export const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Valid hex color required'),
];

export const customerValidation = [
  body('name').trim().notEmpty().withMessage('Customer name is required'),
  body('email').optional().isEmail().withMessage('Valid email required'),
];

export const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('items.*.product').notEmpty().withMessage('Product ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
];

export const paymentValidation = [
  body('method').isIn(['cash', 'card', 'upi']).withMessage('Valid payment method required'),
  body('amount').optional().isFloat({ min: 0 }),
];
