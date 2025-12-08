import { verifyToken } from '../utils/jwt.js';

// Authentication Middleware - Check karo user logged in hai ya nahi
export const authenticate = (req, res, next) => {
    try {
        // Headers se Authorization token nikalo
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];

        // Token verify karo
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // User data request object mein add karo taaki aage use kar sakein
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

// Authorization Middleware - Check karo user Admin hai ya nahi
export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin rights required.' });
    }
};
