# E-Commerce Product & Order System

A modern, full-stack e-commerce platform built with **React**, **Node.js**, **Express**, **MySQL**, and **Prisma ORM**. Features a clean architecture, JWT authentication, and a detailed codebase with Hinglish comments for better understanding.

![Tech Stack](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)

---

## Features

### User Features
- **Authentication** - Secure registration and login with JWT tokens
- **Product Browsing** - View premium tech products
- **Shopping Cart** - Seamless add/remove functionality
- **Order System** - Place orders and track status
- **Real-time Validation** - Stock checking before order placement

### Admin Features
- **Product Management** - Create, update, delete products
- **Order Management** - Update order status (Pending -> Delivered)
- **Dashboard** - View all user orders

### Technical Highlights
- **No-API-Folder Architecture** - Direct Axios calls in components for clarity
- **Hinglish Comments** - Important logic explained in simple Hindi-English mix
- **Proxy Setup** - Vite forwarding `/api` requests to backend
- **Prisma ORM** - Type-safe database queries
- **Security** - Bcrypt hashing & middleware protection

---

## Project Structure

```
ecommerce-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Prisma connection
│   │   ├── controllers/              # Business logic (with Hinglish comments)
│   │   ├── routes/                   # API Routes
│   │   ├── middlewares/              # Auth & Admin checks
│   │   └── server.js                 # Entry point
│   ├── prisma/
│   │   └── schema.prisma             # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Nav, Cards, etc.
│   │   ├── pages/                    # Home, Cart, Orders, Admin
│   │   ├── utils/
│   │   │   └── auth.js               # Token helpers
│   │   └── App.jsx                   # Routing
│   ├── vite.config.js                # Proxy configuration
│   └── package.json
│
└── database/
    └── schema.sql                    # Legacy SQL (optional)
```

---

## Getting Started

### Prerequisites
- **Node.js** (v16+)
- **MySQL** installed and running

### 1. Database Setup (MySQL)
Create a database named `ecommerce_db`:
```sql
CREATE DATABASE ecommerce_db;
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Connect to Database
# Create .env file and add:
# DATABASE_URL="mysql://root:password@localhost:3306/ecommerce_db"
# JWT_SECRET="your_secret_key"

# Push Schema to Database (Prisma)
npx prisma db push

# Start Server
npm start
```
Server runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start React Dev Server
npm run dev
```
App runs on: `http://localhost:3000` (Proxies API requests to 5000)

---

## Key Concepts for Learners

- **Proxy**: Frontend sends requests to `/api/...`. Vite's `vite.config.js` sees this and forwards it to `localhost:5000`. This solves CORS issues.
- **Hinglish Comments**: Controllers map logic is explained simply. Example: `// Cart se order create karne ke liye`.
- **Inline API**: Instead of a separate folder, API calls are right inside `useEffect` or button handlers, making it easier to trace execution.

---

## Default Credentials

**Admin:**
- Register a new user with any email, then verify `role` in database is `admin` (or manually update it).
- Or check `seed.js` if available.

---

## License
Open Source.
