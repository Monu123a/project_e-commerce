import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import axios from 'axios';

// Configure Axios for Production/Development
// In development, this uses the Vite proxy at /api
// In production, set VITE_API_URL to your backend URL (e.g., https://my-backend.onrender.com)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://project-e-commerce-mfjk.onrender.com';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
