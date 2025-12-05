import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        // Prisma will connect automatically when needed
        console.log('Using Prisma ORM with MySQL database');

        // Start listening
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`API endpoints available at http://localhost:${PORT}/api`);
            console.log(`Database: MySQL (ecommerce_db)`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
