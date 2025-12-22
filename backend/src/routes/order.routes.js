import express from 'express';
import { body } from 'express-validator';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} from '../controllers/order.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Validation rules define karo
const updateStatusValidation = [
    body('status')
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid status value')
];

// User routes (login zaroori hai)
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);

// Admin routes - Sirf admin ke liye
router.get('/all/orders', authenticate, authorizeAdmin, getAllOrders);
router.put('/:id/status', authenticate, authorizeAdmin, updateStatusValidation, updateOrderStatus);

export default router;
