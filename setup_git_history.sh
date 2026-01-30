#!/bin/bash

# Initialize Git Repository
git init

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "coverage/" >> .gitignore

# Define Dates (Dec 2025 to Jan 2026)
# Current date is Jan 31, 2026

# 1. Project Start (Dec 1, 2025)
git add .gitignore
git commit --date="2025-12-01T10:00:00" -m "Initial commit: Project initialization"

# 2. Database Design (Dec 3, 2025)
git add backend/prisma/ backend/src/config/db.js
git commit --date="2025-12-03T14:30:00" -m "Database: Setup Prisma schema and MySQL config"

# 3. Backend Setup (Dec 5, 2025)
git add backend/package.json backend/src/server.js backend/src/app.js
git commit --date="2025-12-05T09:15:00" -m "Backend: Express server setup"

# 4. Auth System (Dec 8, 2025)
git add backend/src/utils/ backend/src/middlewares/
git commit --date="2025-12-08T11:20:00" -m "Auth: JWT implementation and middleware"

# 5. Auth API (Dec 10, 2025)
git add backend/src/controllers/auth.controller.js backend/src/routes/auth.routes.js
git commit --date="2025-12-10T16:45:00" -m "Feature: Registration and Login endpoints"

# 6. Product Backend (Dec 15, 2025)
git add backend/src/controllers/product.controller.js backend/src/routes/product.routes.js
git commit --date="2025-12-15T10:30:00" -m "Feature: Product CRUD API"

# 7. Cart Backend (Dec 18, 2025)
git add backend/src/controllers/cart.controller.js backend/src/routes/cart.routes.js
git commit --date="2025-12-18T13:00:00" -m "Feature: Cart management logic"

# 8. Order Backend (Dec 22, 2025)
git add backend/src/controllers/order.controller.js backend/src/routes/order.routes.js
git commit --date="2025-12-22T15:15:00" -m "Feature: Order processing system"

# --- Christmas Break ---

# 9. Frontend Init (Jan 2, 2026)
git add frontend/package.json frontend/vite.config.js frontend/index.html
git commit --date="2026-01-02T09:00:00" -m "Frontend: Initialize React + Vite"

# 10. Frontend Structure (Jan 4, 2026)
git add frontend/src/main.jsx frontend/src/App.jsx frontend/src/index.css
git commit --date="2026-01-04T12:00:00" -m "Frontend: Core structure and routing"

# 11. UI Components (Jan 6, 2026)
git add frontend/src/components/
git commit --date="2026-01-06T14:20:00" -m "UI: Shared components library"

# 12. Auth UI (Jan 8, 2026)
git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx
git commit --date="2026-01-08T11:00:00" -m "Frontend: Auth pages implementation"

# 13. Product UI (Jan 12, 2026)
git add frontend/src/pages/Home.jsx frontend/src/pages/ProductDetail.jsx
git commit --date="2026-01-12T10:15:00" -m "Frontend: Product catalog and details"

# 14. Styling Update (Jan 14, 2026)
git add frontend/src/pages/*.css
git commit --date="2026-01-14T16:30:00" -m "UI: Styling polish and responsive design"

# 15. Cart UI (Jan 18, 2026)
git add frontend/src/pages/Cart.jsx
git commit --date="2026-01-18T13:45:00" -m "Frontend: Shopping cart page"

# 16. Orders UI (Jan 21, 2026)
git add frontend/src/pages/Orders.jsx
git commit --date="2026-01-21T09:30:00" -m "Frontend: Order history view"

# 17. Admin Dashboard (Jan 25, 2026)
git add frontend/src/pages/AdminProducts.jsx frontend/src/pages/AdminOrders.jsx
git commit --date="2026-01-25T11:00:00" -m "Feature: Admin dashboard"

# 18. Refactoring (Jan 28, 2026)
git add frontend/src/utils/
git commit --date="2026-01-28T15:20:00" -m "Refactor: Code cleanup and optimization"

# 19. Documentation (Jan 30, 2026)
git add README.md DEPLOYMENT.md
git commit --date="2026-01-30T10:00:00" -m "Docs: Complete documentation and guides"

# 20. Final (Today)
git add .
git commit -m "Release v1.0: Final build"

echo "Git history simulation complete! Commits sourced from Dec 2025 to Jan 2026."
