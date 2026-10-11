# CafeVibes

**The Digital Heartbeat of Your Cafe**

A complete production-ready MERN Stack Restaurant POS & Kitchen Management System.

## Features

- **Authentication** — JWT, Google OAuth, refresh tokens, role-based access (Admin/Employee)
- **POS Terminal** — Product search, category filters, cart management, multi-payment
- **Kitchen Display** — Real-time order tracking via Socket.io
- **Product & Category Management** — Full CRUD with color-coded categories
- **Floor & Table Management** — Visual table states (available/occupied)
- **Customer Management** — Profiles with order history tracking
- **Coupons & Promotions** — Fixed/percentage discounts with auto-apply
- **Payment System** — Cash, Card, UPI QR code generation
- **Receipt System** — Printable HTML, PDF download, email receipts
- **Reports & Analytics** — Revenue charts, top products/categories, Excel/PDF export

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React (Vite), Tailwind CSS, Framer Motion, React Query, Recharts, Socket.io |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Passport Google OAuth, Socket.io |
| Tools | QR Code, PDFKit, ExcelJS, Nodemailer |

## Prerequisites

- Node.js 18+
- MongoDB (local via MongoDB Compass or Atlas)
- Google OAuth credentials (optional, for Google login)

## Setup

### 1. Clone and install

```bash
cd CafeVibes

# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, Google OAuth, SMTP settings
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/cafevibes
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Create `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start MongoDB

Ensure MongoDB is running locally (default: `mongodb://localhost:27017`).

### 4. Run the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Default Roles

- The **first registered user** automatically becomes **Admin**
- Subsequent users are **Employees** (routed to POS Terminal after login)
- Admins are routed to the Dashboard

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /api/auth/register`, `login`, `refresh`, `logout`, `GET /me`, `GET /google` |
| Products | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id` |
| Categories | `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/:id` |
| Floors/Tables | `GET/POST /api/floors`, `GET/POST /api/tables` |
| Customers | `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/:id` |
| Coupons | `GET/POST /api/coupons`, `POST /api/coupons/validate` |
| Promotions | `GET/POST /api/promotions` |
| Orders | `GET/POST /api/orders`, `GET /api/orders/kitchen` |
| Payments | `POST /api/payments/:id/pay`, `GET /api/payments/:id/qr` |
| Receipts | `GET /api/receipts/:id/html`, `pdf`, `POST /email` |
| Reports | `GET /api/reports/dashboard`, `sales-trend`, `top-products`, `export/excel`, `export/pdf` |

## Project Structure

```
CafeVibes/
├── backend/
│   ├── config/          # DB, Passport
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, roles, validation, rate limiting
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Email, receipts, reports, QR
│   ├── sockets/         # Kitchen real-time
│   ├── utils/           # Helpers
│   ├── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/  # Reusable UI
        ├── context/     # Auth context
        ├── layouts/     # Dashboard layout
        ├── pages/       # All page components
        ├── routes/      # Route guards
        ├── services/    # API & Socket
        ├── store/       # Cart state
        └── utils/       # Helpers
```

## License

MIT
