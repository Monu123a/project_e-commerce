import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import prisma from '../config/db.js';
import { generateToken } from '../utils/jwt.js';

// Naya user register karne ke liye
export const register = async (req, res) => {
    try {
        // Input validation check karo
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check karo agar user pehle se exist karta hai
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Password ko encrypt karo security ke liye
        const hashedPassword = await bcrypt.hash(password, 10);

        // Database mein naya user banao
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // Token generate karo login ke liye
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// User login karne ke liye
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // User ko email se dhundo
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Agar user nahi mila
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Password match karo
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Token generate karo
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
