import express from 'express';
import { body } from 'express-validator';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Validation rules define karo
const addToCartValidation = [
    body('product_id').isInt({ min: 1 }).withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const updateCartValidation = [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Saare cart routes ke liye login zaroori hai
router.use(authenticate);

router.get('/', getCart);
router.post('/', addToCartValidation, addToCart);
router.put('/:id', updateCartValidation, updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;
