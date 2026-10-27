# FeastFlow - Online Food Ordering Service & Management System

A dynamic, full-stack web application designed for online food ordering, menu administration, and customer order management with complete CRUD capabilities.

---

## 🌟 Key Features

### 1. Menu & Food Items Management (CRUD Operations)
- **Display Food Items (Read)**:
  - Browse dishes categorized by Starters, Main Course, Burgers & Pizzas, Desserts, and Beverages.
  - Live search across dish names and ingredient descriptions.
  - Quick filters: Pure Veg Only, In-Stock Only, and Sort by Price (Low/High), Rating, or Name.
  - Food cards showcase photos, preparation time, spice level, calories, dietary tags (Veg/Non-Veg), and stock availability.
- **Add New Dishes (Create)**:
  - Add new dishes with Name, Category, Price, Image URL (with preset suggestions), Veg/Non-Veg flag, Spice Level, Calories, Prep Time, and Description.
- **Update Menu Details (Update)**:
  - Edit modal pre-filled with existing dish details to update prices, descriptions, and categories.
  - One-click stock availability toggle (In Stock ↔ Sold Out).
- **Delete Dishes (Delete)**:
  - Remove dishes from the menu with safety confirmation prompts.

### 2. Customer Cart & Checkout
- **Real-Time Shopping Cart**:
  - Quantity controls (`+` / `-`), remove item, and empty cart.
  - Free delivery threshold tracker (free delivery for orders over $35).
  - Promo discount codes (e.g., `FEAST20` for 20% off, `WELCOME10` for 10% off).
  - Itemized bill breakdown (Subtotal, Tax 8%, Delivery fee, Discount, Total).
- **Checkout Modal**:
  - Customer contact details (Name, Phone number, Email).
  - Delivery address & custom cooking/delivery instructions.
  - Payment method choices: Cash on Delivery, Credit/Debit Card, UPI / Online Pay.

### 3. Customer Orders Management (CRUD Operations)
- **Customer Live Order Tracking (Read)**:
  - Visual 4-step progress stepper: `Order Placed` ➔ `In Kitchen` ➔ `On The Way` ➔ `Delivered` (or `Cancelled`).
  - Search order status by Order Number (e.g., `ORD-XXXX`) or phone number.
  - Itemized ordered foods summary and delivery details.
- **Order Operations Dashboard for Staff/Admin (Update & Delete)**:
  - KPI overview: Total Revenue, Total Orders, Pending Confirmation, Kitchen Cooking, Out for Delivery, Delivered.
  - Status progression dropdown and quick "Advance to Next Stage" button.
  - Edit customer contact details and delivery notes.
  - Cancel / delete orders.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Modern Vanilla CSS with responsive design.
- **Backend**: Node.js, Express 5, Sequelize ORM, CORS, Dotenv.
- **Database**: Dual-driver support (Instant offline-ready SQLite `restaurant.sqlite` + PostgreSQL support).

---

## 🚀 How to Run

### Option 1: Unified Full-Stack Server (Recommended)
The backend serves both the API and the pre-built React frontend from port `8000`:

```bash
# In the project root directory
npm start
```
Then open your browser at **http://localhost:8000**.

### Option 2: Run Development Mode (Vite Hot Reload)

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Dev Server):**
```bash
cd frontend
npm run dev
```
Then open your browser at **http://localhost:5173**.
