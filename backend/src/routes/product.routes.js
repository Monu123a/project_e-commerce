import express from 'express';
import { body } from 'express-validator';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Validation rules define karo
const productValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').optional().trim(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Public routes - Sabke liye khule hain
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes - Sirf admin access kar sakta hai
router.post('/', authenticate, authorizeAdmin, productValidation, createProduct);
router.put('/:id', authenticate, authorizeAdmin, productValidation, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;
