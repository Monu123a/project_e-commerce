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



    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Wireless Headphones',
                description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
                price: 12499,
                stock: 50
            }
        }),
        prisma.product.create({
            data: {
                name: 'Smart Watch',
                description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
                price: 24999,
                stock: 30
            }
        }),
        prisma.product.create({
            data: {
                name: 'Laptop Stand',
                description: 'Ergonomic aluminum laptop stand with adjustable height',
                price: 4199, // Helps improve posture while working
                stock: 100
            }
        }),
        prisma.product.create({
            data: {
                name: 'USB-C Hub',
                description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
                price: 3299, // Essential for modern laptops
                stock: 75
            }
        }),
        prisma.product.create({
            data: {
                name: 'Mechanical Keyboard',
                description: 'RGB backlit mechanical keyboard with blue switches',
                price: 10799, // Gamers and coders will love this
                stock: 40
            }
        }),
        prisma.product.create({
            data: {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with precision tracking',
                price: 4999, // Smooth and responsive
                stock: 80
            }
        }),
        prisma.product.create({
            data: {
                name: 'Webcam HD',
                description: '1080p HD webcam with built-in microphone',
                price: 6699, // Crystal clear video for meetings
                stock: 60
            }
        }),
        prisma.product.create({
            data: {
                name: 'Phone Case',
                description: 'Protective phone case with shock absorption',
                price: 2099, // Keep your phone safe from drops
                stock: 200
            }
        }),
        prisma.product.create({
            data: {
                name: 'Portable Charger',
                description: '20000mAh portable power bank with fast charging',
                price: 3749, // Never run out of battery again
                stock: 90
            }
        }),
        prisma.product.create({
            data: {
                name: 'Bluetooth Speaker',
                description: 'Waterproof Bluetooth speaker with 12-hour battery',
                price: 7499, // Take your music anywhere
                stock: 55
            }
        })
    ]);

    console.log('Created 10 products');

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
