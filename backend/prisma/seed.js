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
        {
            name: 'Premium Wireless Noise-Cancelling Headphones - 40hr Battery, Hi-Res Audio',
            description: 'Experience premium sound quality with industry-leading noise cancellation. Features 40-hour battery life, Hi-Res Audio support, multipoint connection, and ultra-comfortable design for all-day wear. Touch sensor controls, speak-to-chat, and adaptive sound control.',
            price: 24999,
            stock: 25,
            imageUrl: '/images/products/headphones.png'
        },
        {
            name: 'Ultra Smartphone 5G - 108MP Camera, 6.7" AMOLED, 5000mAh Battery',
            description: 'Flagship smartphone with 108MP quad camera system, 6.7-inch Dynamic AMOLED 2X display, 120Hz refresh rate, Snapdragon 8 Gen 2 processor, 5000mAh battery with 65W fast charging, and 256GB storage. IP68 water resistance.',
            price: 69999,
            stock: 15,
            imageUrl: '/images/products/smartphone.png'
        },
        {
            name: 'ProBook Ultra Laptop - M2 Chip, 16GB RAM, 512GB SSD, 14" Retina Display',
            description: 'Powerhouse laptop featuring the latest M2 chip, 16GB unified memory, 512GB SSD storage, stunning 14-inch Liquid Retina XDR display. Up to 18 hours of battery life. Perfect for professionals, creators, and developers.',
            price: 149999,
            stock: 8,
            imageUrl: '/images/products/laptop.png'
        },
        {
            name: 'SmartWatch Ultra - GPS, Heart Rate, Blood Oxygen, 7-Day Battery',
            description: 'Advanced smartwatch with always-on Retina display, blood oxygen monitoring, ECG app, heart rate tracking, sleep analysis, GPS, and water resistance to 100m. 7-day battery life with fast charging. 100+ workout modes.',
            price: 34999,
            stock: 32,
            imageUrl: '/images/products/smartwatch.png'
        },
        {
            name: 'Mirrorless Digital Camera - 24.2MP, 4K Video, Weather-Sealed Body',
            description: 'Professional mirrorless camera with 24.2MP full-frame sensor, real-time Eye AF, 4K HDR video recording, 5-axis image stabilization, weather-sealed body. Includes 24-70mm f/2.8 GM II lens. Perfect for photography and videography professionals.',
            price: 189999,
            stock: 5,
            imageUrl: '/images/products/camera.png'
        },
        {
            name: 'Portable Bluetooth Speaker - 360° Sound, 24hr Playtime, Waterproof',
            description: 'Premium portable Bluetooth speaker delivering immersive 360-degree sound. Features 24-hour battery life, IP67 waterproof and dustproof rating, built-in microphone for calls, and wireless stereo pairing. PartyBoost compatible.',
            price: 8999,
            stock: 50,
            imageUrl: '/images/products/speaker.png'
        },
        {
            name: 'Pro Tablet 12.9" - M2 Chip, 256GB, Liquid Retina XDR, Wi-Fi + 5G',
            description: 'The ultimate iPad experience with the powerful M2 chip, brilliant 12.9-inch Liquid Retina XDR display, ProMotion technology, and Thunderbolt connectivity. Features 12MP Ultra Wide front camera with Center Stage. Apple Pencil hover support.',
            price: 112999,
            stock: 12,
            imageUrl: '/images/products/tablet.png'
        },
        {
            name: 'True Wireless Earbuds Pro - ANC, 30hr Battery, Spatial Audio',
            description: 'Premium true wireless earbuds with Active Noise Cancellation, Transparency mode, Spatial Audio with dynamic head tracking. 30-hour total battery life with MagSafe charging case. IPX4 water and sweat resistant. Touch controls.',
            price: 19999,
            stock: 40,
            imageUrl: '/images/products/earbuds.png'
        },
        {
            name: 'Mechanical Gaming Keyboard - RGB, Hot-Swappable, Wireless/Wired',
            description: 'Professional mechanical gaming keyboard with hot-swappable switches, per-key RGB backlighting, tri-mode connectivity (Bluetooth, 2.4GHz wireless, USB-C wired). Aircraft-grade aluminum frame, PBT keycaps, N-key rollover.',
            price: 12999,
            stock: 22,
            imageUrl: '/images/products/keyboard.png'
        },
        {
            name: 'Wireless Gaming Mouse - 25K DPI, 70hr Battery, Ultra-Lightweight',
            description: 'High-performance wireless gaming mouse with 25,600 DPI HERO 25K sensor, LIGHTSPEED wireless technology, 70-hour battery life, ultra-lightweight 63g design. 5 programmable buttons, onboard memory, RGB lighting.',
            price: 6999,
            stock: 35,
            imageUrl: '/images/products/headphones.png'
        },
        {
            name: '20000mAh Power Bank - 65W Fast Charging, USB-C, Laptop Compatible',
            description: 'High-capacity 20000mAh portable charger with 65W USB-C Power Delivery for laptops, tablets, and phones. Features smart temperature control, LED display, and simultaneous 3-device charging. TSA approved for flights.',
            price: 4999,
            stock: 60,
            imageUrl: '/images/products/speaker.png'
        },
        {
            name: '4K Ultra-Wide Curved Monitor 34" - 144Hz, HDR 400, USB-C Hub',
            description: 'Immersive 34-inch ultra-wide QHD curved monitor with 144Hz refresh rate, 1ms response time, HDR 400, 98% DCI-P3 color gamut. Built-in USB-C hub with 90W power delivery. Perfect for gaming and creative work.',
            price: 54999,
            stock: 7,
            imageUrl: '/images/products/laptop.png'
        }
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
