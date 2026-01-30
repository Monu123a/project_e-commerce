# Deployment Guide

This guide explains how to host your E-Commerce application for free using modern cloud platforms.

---

## 🚀 fast-track Summary

| Component | Service | Tier | Notes |
|-----------|---------|------|-------|
| **Frontend** | [Vercel](https://vercel.com) | Free | Automatic builds, global CDN |
| **Backend** | [Render](https://render.com) | Free | Spins down after inactivity (slow first request) |
| **Database** | [TiDB Cloud](https://tidbcloud.com) | Free | MySQL compatible, serverless |

---

## 1. Database Setup (TiDB / Aiven)

Since our project uses **MySQL**, we need a cloud MySQL provider.

1.  **Sign up** for [TiDB Cloud](https://tidbcloud.com) or [Aiven](https://aiven.io).
2.  **Create a Cluster** (Select "Serverless" or "Free Plan").
3.  **Get Connection String**:
    It will look like: `mysql://user:password@gateway01.region.prod.aws.tidbcloud.com:4000/test`
4.  **Important**: You might need to add `?ssl={"rejectUnauthorized":true}` to the end of the URL for secure connection.

---

## 2. Backend Deployment (Render)

1.  **Push your code to GitHub**.
2.  **Sign up** for [Render](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install && npx prisma generate` (Installs deps & generates schema client)
    *   **Start Command**: `npm start`
6.  **Environment Variables**:
    Add the following keys in the "Environment" tab:
    *   `DATABASE_URL`: (Paste your cloud database string from Step 1)
    *   `JWT_SECRET`: (Any long random string, e.g., `my_super_secret_key_123`)
    *   `NODE_ENV`: `production`
7.  **Deploy**: Click "Create Web Service".
    *   *Note: Copy the URL provided by Render (e.g., `https://ecommerce-api.onrender.com`). You will need it for the frontend.*

---

## 3. Frontend Deployment (Vercel)

1.  **Sign up** for [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Project Settings**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  **Environment Variables**:
    *   **Name**: `VITE_API_URL`
    *   **Value**: (Your Render Backend URL, e.g., `https://ecommerce-api.onrender.com`)
    *   *Note: Do NOT add a trailing slash `/` at the end.*
6.  **Deploy**: Click "Deploy".

---

## 4. Final Configuration

### Initialize the Database in Production
Since we can't run `setup-database.sh` in the cloud easily, we use Prisma.

1.  In your local terminal:
    ```bash
    # Update your local .env to point to the PROD database temporarily
    DATABASE_URL="mysql://user:password@cloud-url..."
    
    # Push the schema structure to the cloud DB
    npx prisma db push
    
    # (Optional) Run seed data script if you want default products
    # You might need to run `node seed.js` manually or add a seed script to package.json
    ```

---

## Troubleshooting

-   **CORS Errors**: If frontend fails to connect to backend, check `server.js` or `app.js`. Ensure `cors()` is enabled (it is included in your project).
-   **Backend Sleeping**: Render free tier sleeps after 15 mins. The first request might take 30-50 seconds.
-   **Database Connection**: Ensure your cloud database allows connections from "Anywhere" (0.0.0.0/0) or whitelists Render's IPs.
