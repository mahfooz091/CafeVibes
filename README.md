# ☕ CafeVibes

<p align="center">
  <b>The Digital Heartbeat of Your Cafe</b><br/>
  <i>A complete production-ready MERN Stack Restaurant POS & Kitchen Management System.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Introduction

**CafeVibes** is an all-in-one restaurant and cafe management system designed to streamline operations, coordinate kitchen orders, manage table states, process checkout transactions, and provide business performance analytics. 

Built using the **MERN (MongoDB, Express, React, Node.js)** stack, CafeVibes implements modern web practices, including a real-time Socket.io kitchen display system, responsive Tailwind CSS dashboards, fluid Framer Motion animations, state synchronization with Zustand and React Query, and robust secure cookie/JWT-based role authentication.

---

## 🖥️ Screen Showcases & Features

Here is a visual walkthrough of the platform interfaces, matching the screenshots provided in the [Screenshots/](file:///Users/mahfoozalam/Desktop/CafeVibes/Screenshots) directory:

### 1. Public & Core Portals
*   **Landing Page**: A clean, responsive public introduction showcase presenting CafeVibes.
    <p align="center"><img src="Screenshots/landingpage.jpeg" width="90%" alt="Landing Page" /></p>
*   **Authentication & Access**: Standard form validation and secure signups with role-based routing (Admin vs. Employee).
    <table align="center" width="100%">
      <tr>
        <td width="50%" align="center"><b>Sign Up</b></td>
        <td width="50%" align="center"><b>Log In</b></td>
      </tr>
      <tr>
        <td><img src="Screenshots/Signup.jpeg" width="100%" alt="Sign Up" /></td>
        <td><img src="Screenshots/Login.jpeg" width="100%" alt="Login" /></td>
      </tr>
    </table>

---

### 2. POS Terminal & Checkout
*   **POS Terminal Interface**: Quick product search, categorizations, color-coded identifiers, and interactive catalog browsing.
    <p align="center"><img src="Screenshots/POSTerminal.jpeg" width="90%" alt="POS Terminal" /></p>
*   **Active Cart & Checkout Drawer**: Visual cart calculation displaying item lists, subtotals, custom discounts, and payment methods.
    <p align="center"><img src="Screenshots/POSCart.jpeg" width="90%" alt="POS Cart" /></p>
*   **Dynamic Payments & Invoicing**: Generates instant UPI/cash QR Codes for cashless transactions and prints elegant formatted HTML customer receipts.
    <table align="center" width="100%">
      <tr>
        <td width="50%" align="center"><b>Payment QR Code</b></td>
        <td width="50%" align="center"><b>Bill / Receipt View</b></td>
      </tr>
      <tr>
        <td><img src="Screenshots/QRCode.jpeg" width="100%" alt="QR Code Payment" /></td>
        <td><img src="Screenshots/Receipt.jpeg" width="100%" alt="Bill Receipt" /></td>
      </tr>
    </table>

---

### 3. Kitchen Operations & Order Logs
*   **Real-time Kitchen Display System (KDS)**: Dynamically updates orders using Socket.io. Shows order timer countdowns, item checklists, and lets chefs mark tickets as complete instantly.
    <p align="center"><img src="Screenshots/Kitchen.jpeg" width="90%" alt="Kitchen Display System" /></p>
*   **Detailed Order Lists**: Review past, active, pending, and completed orders with comprehensive search and metadata tracking.
    <p align="center"><img src="Screenshots/Orders.jpeg" width="90%" alt="Order Management" /></p>

---

### 4. Space & Operations Layout
*   **Floor & Table Seating Engine**: Visual floor layouts mapping physical dining spaces. Dynamically tracks table state (available, occupied, or reserved) to synchronize POS and kitchen ticketing.
    <p align="center"><img src="Screenshots/Floor&Tabels.jpeg" width="90%" alt="Floor & Tables Management" /></p>

---

### 5. Administrative Controls & Analytics
*   **Performance Dashboards**: Executive oversight on total sales, active orders, customer counts, and real-time revenue breakdowns.
    <p align="center"><img src="Screenshots/Dashboard.jpeg" width="90%" alt="Admin Dashboard" /></p>
*   **Sales & Business Reports**: Financial summaries detailing revenue trends and item performance, with options to export lists to Excel/PDF.
    <p align="center"><img src="Screenshots/Reports.jpeg" width="90%" alt="Reports & Analytics" /></p>
*   **Resource & Settings Panel**: General system configs, printer choices, currency preferences, and theme choices.
    <p align="center"><img src="Screenshots/Settings.jpeg" width="90%" alt="Settings" /></p>

---

### 6. Catalog, Promotions & Staff CRM
Manage key database entities with standard responsive CRUD modals:
*   **Products & Category Panels**: Color-coded categorization and catalog tracking.
    <table align="center" width="100%">
      <tr>
        <td width="50%" align="center"><b>Products Manager</b></td>
        <td width="50%" align="center"><b>Categories Manager</b></td>
      </tr>
      <tr>
        <td><img src="Screenshots/Products.jpeg" width="100%" alt="Products" /></td>
        <td><img src="Screenshots/Categories.jpeg" width="100%" alt="Categories" /></td>
      </tr>
    </table>
*   **Coupons & Customer Relationship (CRM)**: Custom percentage/fixed value discounts and detailed customer logs.
    <table align="center" width="100%">
      <tr>
        <td width="50%" align="center"><b>Coupons & Promos</b></td>
        <td width="50%" align="center"><b>Customer CRM Profiles</b></td>
      </tr>
      <tr>
        <td><img src="Screenshots/Coupons.jpeg" width="100%" alt="Coupons" /></td>
        <td><img src="Screenshots/Customers.jpeg" width="100%" alt="Customers" /></td>
      </tr>
    </table>
*   **Staff & User Control**: Manage user profiles, active employees, roles (Admin vs. Employee), and access status.
    <table align="center" width="100%">
      <tr>
        <td width="50%" align="center"><b>Admin Staff Grid</b></td>
        <td width="50%" align="center"><b>Employee Profile Page</b></td>
      </tr>
      <tr>
        <td><img src="Screenshots/Employee.jpeg" width="100%" alt="Employee Admin Page" /></td>
        <td><img src="Screenshots/EmployeePage.jpeg" width="100%" alt="Employee Dashboard Page" /></td>
      </tr>
    </table>

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|:---|:---|:---|
| **Frontend** | React (Vite) | Powered by SPA routing, standard hooks, and fast builds. |
| | Tailwind CSS | Sleek, modern, and fully responsive custom design system. |
| | Zustand | Lightweight client state management for the POS checkout cart. |
| | React Query | Handles asynchronous API caching and state validation. |
| | Framer Motion | Smooth component-level animations and layout transitions. |
| | Recharts | Renders dynamic financial analytics and trend graphs. |
| | Socket.io Client | Listen to instant order tickets on the Kitchen screen. |
| **Backend** | Node.js & Express | Extensible, modular MVC architecture with clean API patterns. |
| | MongoDB & Mongoose | Document-oriented schemas mapping relationships between products, users, orders, and tables. |
| | JWT & Cookies | Secure cookies combined with JSON Web Tokens and refresh flows. |
| | Socket.io | Server-side web socket server dispatching live updates to terminal clients. |
| **Utilities** | Lucide React | Clean, scalable vector outline icons. |
| | BcryptJS | Salted password hashing algorithms for secure database records. |
| | Express Rate Limit | API route protection against high-frequency traffic spikes. |

---

## ⚙️ Setup & Installation

### Prerequisites
*   **Node.js**: Version 18.x or higher installed.
*   **MongoDB**: Run a local instance (e.g., via MongoDB Compass) or setup a MongoDB Atlas cloud URI.

### 1. Clone & Dependency Setup
First, navigate to your local working directory and install the necessary dependencies:

```bash
cd CafeVibes

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
You need to configure credentials for both the backend and frontend.

#### Backend Configuration
Create a `.env` file inside the `backend/` folder based on `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cafevibes
JWT_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional OAuth & Mailer
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Frontend Configuration
Create a `.env` file inside the `frontend/` folder (optional, falls back to defaults if not present):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Database Initialization
Ensure your MongoDB local instance is active. By default, it looks for:
`mongodb://127.0.0.1:27017/cafevibes`

### 4. Running the Development Server
Run the backend and frontend services simultaneously in two terminal screens:

#### Terminal 1: Start Backend API & Sockets
```bash
cd backend
npm run dev
```
*API runs at http://localhost:5000/api*  
*Health Check: http://localhost:5000/api/health*

#### Terminal 2: Start Frontend Web App
```bash
cd frontend
npm run dev
```
*Frontend runs at http://localhost:5173*

---

## 📂 Project Architecture

```
CafeVibes/
├── backend/
│   ├── config/          # DB connections, Passport Google OAuth configurations
│   ├── controller/      # Controller structures (express middleware handlers)
│   ├── controllers/     # Authentication & Auth flow handlers
│   ├── middleware/      # Auth protection, Role access validations, Error handlers
│   ├── models/          # MongoDB Mongoose models (User, Table, Floor, Order, Product, etc.)
│   ├── routes/          # Express API route endpoints
│   ├── sockets/         # Socket.io connection handlers for kitchen updates
│   ├── utils/           # Global helpers, custom API error/response handlers
│   ├── app.js           # App initialization & core middleware configuration
│   └── server.js        # Server execution, socket hookup & DB listener
└── frontend/
    └── src/
        ├── components/  # Reusable design components (buttons, inputs, cards, layouts)
        ├── context/     # Global React Context providers (AuthContext)
        ├── layouts/     # Page-level dashboard and shell layouts
        ├── pages/       # SPA routing pages (POS, KitchenDisplay, Reports, Coupons, etc.)
        ├── routes/      # Guard routes (ProtectedRoute, AdminRoute)
        ├── services/    # REST API calling modules & Socket.io listeners
        ├── store/       # Zustand POS cart stores
        └── utils/       # Utility converters, price formatters
```

---

## 🔐 System Roles & Default Behavior
*   **Role Setup**: System checks for user status. The **first registered user** on a fresh database automatically inherits the `Admin` role. Subsequent user registrations default to the `Employee` role.
*   **Routing Logic**:
    *   **Admins** are automatically logged into the main **Admin Dashboard** showing metrics and controls.
    *   **Employees** are redirected immediately to the **POS Terminal** to begin processing table seating and customer checkouts.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
