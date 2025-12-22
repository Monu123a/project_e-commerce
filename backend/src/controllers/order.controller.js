import { validationResult } from 'express-validator';
import prisma from '../config/db.js';

// Cart se order create karne ke liye
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // Cart items aur unke product details nikalo
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Sabhi items ka stock check karo
        for (const item of cartItems) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${item.product.name}`
                });
            }
        }

        // Total amount calculate karo
        const total = cartItems.reduce((sum, item) =>
            sum + (item.product.price * item.quantity), 0
        );

        // Transaction use karo taaki order aur stock update ek saath ho
        const order = await prisma.$transaction(async (tx) => {
            // Order create karo
            const newOrder = await tx.orders.create({
                data: {
                    userId,
                    total,
                    status: 'pending'
                }
            });

            // Order items create karo aur stock update karo
            for (const item of cartItems) {
                await tx.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }
                });

                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // Cart khaali kar do
            await tx.cartItem.deleteMany({
                where: { userId }
            });

            return newOrder;
        });

        res.status(201).json({
            message: 'Order placed successfully',
            order: {
                id: order.id,
                total: order.total,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// User ke purane orders dekhne ke liye
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await prisma.orders.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Frontend ke liye data format sahi karo
        const formattedOrders = orders.map(order => ({
            id: order.id,
            total: order.total,
            status: order.status,
            created_at: order.createdAt,
            items: order.orderItems
                .map(item => `${item.quantity}x ${item.product.name}`)
                .join(', ')
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Kisi specific order ki details dekhne ke liye
export const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const order = await prisma.orders.findFirst({
            where: {
                id: parseInt(id),
                userId
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Order items ko transform karo
        const items = order.orderItems.map(item => ({
            quantity: item.quantity,
            price: item.price,
            name: item.product.name
        }));

        res.json({
            id: order.id,
            total: order.total,
            status: order.status,
            created_at: order.createdAt,
            items
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// Sirf Admin ke liye - Sabhi orders dekhne ke liye
export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Frontend ke liye data format sahi karo
        const formattedOrders = orders.map(order => ({
            id: order.id,
            total: order.total,
            status: order.status,
            created_at: order.createdAt,
            user_name: order.user.name,
            email: order.user.email
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Sirf Admin ke liye - Order ka status change karne ke liye
export const updateOrderStatus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { status } = req.body;

        await prisma.orders.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Order not found' });
        }
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
};
