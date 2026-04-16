import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seed...');

    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        }
    });

    const john = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedUserPassword,
            role: 'user'
        }
    });

    const jane = await prisma.user.create({
        data: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: hashedUserPassword,
            role: 'user'
        }
    });

    console.log('Created users');



    const productData = [
        { name: 'Wireless Headphones Pro', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life', price: 12499, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
        { name: 'Smart Watch Series X', description: 'Fitness tracking smartwatch with heart rate monitor and GPS', price: 24999, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80' },
        { name: 'Ergo Laptop Stand', description: 'Ergonomic aluminum laptop stand with adjustable height', price: 4199, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
        { name: '7-in-1 USB-C Hub', description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader', price: 3299, stock: 75, imageUrl: 'https://images.unsplash.com/photo-1587826315515-b77da201244e?w=500&q=80' },
        { name: 'RGB Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with blue switches', price: 10799, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
        { name: 'Ergonomic Wireless Mouse', description: 'Ergonomic wireless mouse with precision tracking', price: 4999, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
        { name: '1080p HD Webcam', description: '1080p HD webcam with built-in microphone', price: 6699, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1584697964190-7c83f9828a2a?w=500&q=80' },
        { name: 'Shockproof Phone Case', description: 'Protective phone case with shock absorption', price: 2099, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=500&q=80' },
        { name: '20000mAh Power Bank', description: '20000mAh portable power bank with fast charging', price: 3749, stock: 90, imageUrl: 'https://images.unsplash.com/photo-1609091839311-66c5a08bd2f7?w=500&q=80' },
        { name: 'Waterproof Bluetooth Speaker', description: 'Waterproof Bluetooth speaker with 12-hour battery', price: 7499, stock: 55, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80' },
        { name: 'Gaming Monitor 144Hz', description: '27-inch 144Hz gaming monitor with 1ms response time', price: 35000, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' },
        { name: 'Wireless Earbuds', description: 'Compact wireless earbuds with touch controls and case', price: 8999, stock: 120, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' },
        { name: 'Mechanical Gaming Mouse', description: 'Wired gaming mouse with customizable RGB and weights', price: 6599, stock: 65, imageUrl: 'https://images.unsplash.com/photo-1598462002360-1d89775abed8?w=500&q=80' },
        { name: 'Streaming Microphone', description: 'USB condenser microphone for streaming and podcasting', price: 12000, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80' },
        { name: 'Desk Pad Large', description: 'Extra large desk pad for keyboard and mouse', price: 1599, stock: 150, imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500&q=80' },
        { name: 'Tablet Pro 11-inch', description: 'High-performance tablet with stylus support', price: 65000, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
        { name: 'E-Reader Paperwhite', description: 'Glare-free screen e-reader with weeks of battery', price: 12999, stock: 85, imageUrl: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=500&q=80' },
        { name: 'Action Camera 4K', description: 'Waterproof 4K action camera with stabilization', price: 29999, stock: 35, imageUrl: 'https://images.unsplash.com/photo-1502920514313-52581002a659?w=500&q=80' },
        { name: 'Drone Mini', description: 'Lightweight foldable drone with 1080p camera', price: 45000, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500&q=80' },
        { name: 'VR Headset', description: 'Standalone virtual reality headset', price: 35000, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&q=80' },
        { name: 'Smart Home Hub', description: 'Hub to connect and control smart home devices', price: 8500, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&q=80' },
        { name: 'Smart Light Bulb', description: 'Color-changing Wi-Fi smart light bulb', price: 1200, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&q=80' },
        { name: 'Fitness Band', description: 'Slim fitness tracker with sleep monitoring', price: 3500, stock: 110, imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=500&q=80' },
        { name: 'Portable SSD 1TB', description: 'Fast USB-C portable solid state drive', price: 12000, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&q=80' },
        { name: 'Wi-Fi 6 Router', description: 'High-speed dual-band Wi-Fi 6 router', price: 9000, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=500&q=80' },
        { name: 'Noise-Cancelling Earbuds', description: 'Premium active noise-cancelling wireless earbuds', price: 18000, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1605464315542-a0ce6a877be1?w=500&q=80' },
        { name: 'Smart Thermostat', description: 'Energy-saving programmable smart thermostat', price: 21000, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1560940384-ad4b1b3dc0ce?w=500&q=80' },
        { name: 'Video Doorbell', description: '1080p HD video doorbell with motion detection', price: 15000, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1558002038-16e05c8d62dc?w=500&q=80' },
        { name: 'Cordless Vacuum', description: 'Lightweight cordless stick vacuum cleaner', price: 25000, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80' },
        { name: 'Electric Toothbrush', description: 'Sonic electric toothbrush with timer', price: 4500, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1609114346985-110f6063e52f?w=500&q=80' }
    ];

    const products = await Promise.all(
        productData.map(product => prisma.product.create({ data: product }))
    );



    // Create sample cart items for John
    await prisma.cartItem.create({
        data: {
            userId: john.id,
            productId: products[0].id,
            quantity: 1
        }
    });

    await prisma.cartItem.create({
        data: {
            userId: john.id,
            productId: products[2].id,
            quantity: 2
        }
    });

    console.log('Created cart items');

    // Create sample orders
    const order1 = await prisma.orders.create({
        data: {
            userId: john.id,
            total: 299.98,
            status: 'delivered'
        }
    });

    await prisma.orderItem.createMany({
        data: [
            {
                orderId: order1.id,
                productId: products[0].id,
                quantity: 1,
                price: 149.99
            },
            {
                orderId: order1.id,
                productId: products[3].id,
                quantity: 1,
                price: 49.99
            }
        ]
    });

    const order2 = await prisma.orders.create({
        data: {
            userId: john.id,
            total: 4199,
            status: 'processing'
        }
    });

    await prisma.orderItem.createMany({
        data: [
            {
                orderId: order2.id,
                productId: products[1].id,
                quantity: 1,
                price: 299.99
            },
            {
                orderId: order2.id,
                productId: products[5].id,
                quantity: 1,
                price: 29.99
            }
        ]
    });

    console.log('Created sample orders');
    console.log('');
    console.log('Database seeded successfully!');
    console.log('');
    console.log('Sample credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  john@example.com / user123');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
