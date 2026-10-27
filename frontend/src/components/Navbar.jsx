import React from "react";
import { UtensilsCrossed, ShoppingBag, Clock, ChefHat, LayoutGrid, ShieldCheck } from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  setIsCartOpen,
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand" onClick={() => setActiveTab("menu")} style={{ cursor: "pointer" }}>
          <div className="brand-icon">
            <UtensilsCrossed size={22} color="#ffffff" />
          </div>
          <div className="brand-text">
            <span className="brand-title">FeastFlow</span>
            <span className="brand-subtitle">Gourmet Food & Kitchen</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            <LayoutGrid size={17} />
            <span>Menu</span>
          </button>

          <button
            className={`nav-btn ${activeTab === "my-orders" ? "active" : ""}`}
            onClick={() => setActiveTab("my-orders")}
          >
            <Clock size={17} />
            <span>Track Orders</span>
          </button>

          <div className="nav-divider" />

          {/* Admin Tools */}
          <button
            className={`nav-btn admin-btn ${activeTab === "admin-menu" ? "active" : ""}`}
            onClick={() => setActiveTab("admin-menu")}
            title="Manage Menu Items (CRUD)"
          >
            <ChefHat size={17} />
            <span>Menu Manager</span>
          </button>

          <button
            className={`nav-btn admin-btn ${activeTab === "admin-orders" ? "active" : ""}`}
            onClick={() => setActiveTab("admin-orders")}
            title="Manage Customer Orders (CRUD)"
          >
            <ShieldCheck size={17} />
            <span>Order Ops</span>
          </button>
        </nav>

        {/* Cart Trigger */}
        <div className="navbar-actions">
          <button
            className="cart-trigger-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="View Cart"
          >
            <div className="cart-icon-wrap">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <div className="cart-info">
              <span className="cart-label">Cart</span>
              <span className="cart-amount">${cartTotal.toFixed(2)}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
