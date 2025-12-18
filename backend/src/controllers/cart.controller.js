import { validationResult } from 'express-validator';
import prisma from '../config/db.js';

// User ka cart fetch karne ke liye
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        stock: true
                    }
                }
            }
        });

        // Frontend ke format mein data change karo
        const items = cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            product_id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            stock: item.product.stock
        }));

        // Total price calculate karo
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({ items, total });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};


// Cart mein item add karne ke liye
export const addToCart = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const { product_id, quantity } = req.body;

        // Pehle check karo product hai ya nahi
        const product = await prisma.product.findUnique({
            where: { id: product_id }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Stock check karo
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Agar item pehle se cart mein hai to bas quantity badha do
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: product_id
                }
            }
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            // Update karne se pehle phir se stock check karo
            if (product.stock < newQuantity) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }

            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity }
            });

            return res.json({ message: 'Cart updated successfully' });
        }

        // Naya item cart mein add karo
        await prisma.cartItem.create({
            data: {
                userId,
                productId: product_id,
                quantity
            }
        });

        res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};


// Cart item ki quantity update karne ke liye
export const updateCartItem = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const { id } = req.params;
        const { quantity } = req.body;

        // Item dhundo aur product details bhi lao
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: parseInt(id),
                userId
            },
            include: { product: true }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Stock available hai ya nahi check karo
        if (cartItem.product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        await prisma.cartItem.update({
            where: { id: parseInt(id) },
            data: { quantity }
        });

        res.json({ message: 'Cart item updated successfully' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

// Item ko cart se hatane ke liye
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Security check - sirf apne item hi delete kar sake
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: parseInt(id),
                userId
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        await prisma.cartItem.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

// Poora cart khaali karne ke liye
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        await prisma.cartItem.deleteMany({
            where: { userId }
        });

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};
