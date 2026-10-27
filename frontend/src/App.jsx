import React, { useState, useEffect } from "react";
import { api } from "./api";
import Navbar from "./components/Navbar";
import FoodCatalog from "./components/FoodCatalog";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrderTracking from "./components/OrderTracking";
import AdminMenuManager from "./components/AdminMenuManager";
import AdminOrdersManager from "./components/AdminOrdersManager";
import Toast from "./components/Toast";
import "./App.css";

const DEFAULT_CATEGORIES = [
  "All",
  "Starters",
  "Main Course",
  "Burgers & Pizzas",
  "Desserts",
  "Beverages",
];

function App() {
  const [activeTab, setActiveTab] = useState("menu"); // menu, my-orders, admin-menu, admin-orders
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [loadingFoods, setLoadingFoods] = useState(true);

  // Cart state with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("feastflow_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderTotals, setOrderTotals] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("feastflow_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Cart save error:", e);
    }
  }, [cart]);

  // Fetch foods
  const fetchFoods = async () => {
    try {
      setLoadingFoods(true);
      const data = await api.getFoods({
        category: selectedCategory,
        search: searchQuery,
        isVegetarian: vegOnly ? "true" : "",
        isAvailable: inStockOnly ? "true" : "",
        sortBy,
      });
      setFoods(data);

      // Extract unique categories if dynamic
      const existing = data.map((d) => d.category);
      const merged = Array.from(new Set([...DEFAULT_CATEGORIES, ...existing]));
      setCategories(merged);
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      showToast({ type: "error", message: "Failed to connect to backend API." });
    } finally {
      setLoadingFoods(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFoods();
    fetchOrders();
  }, [selectedCategory, searchQuery, vegOnly, inStockOnly, sortBy]);

  // Cart operations
  const addToCart = (food, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === food.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: food.id,
          name: food.name,
          price: food.price,
          imageUrl: food.imageUrl,
          quantity,
        },
      ];
    });
    showToast({
      type: "success",
      message: `Added ${quantity}× "${food.name}" to cart!`,
    });
  };

  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrderSuccess = (newOrder) => {
    clearCart();
    setOrders((prev) => [newOrder, ...prev]);
    setHighlightedOrderId(newOrder.id);
    setActiveTab("my-orders");
    fetchOrders();
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Main View Render */}
      <main className="main-content">
        {activeTab === "menu" && (
          <FoodCatalog
            foods={foods}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            vegOnly={vegOnly}
            setVegOnly={setVegOnly}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            addToCart={addToCart}
            loading={loadingFoods}
          />
        )}

        {activeTab === "my-orders" && (
          <OrderTracking
            orders={orders}
            refreshOrders={fetchOrders}
            api={api}
            showToast={showToast}
            highlightedOrderId={highlightedOrderId}
          />
        )}

        {activeTab === "admin-menu" && (
          <AdminMenuManager
            foods={foods}
            categories={categories}
            refreshFoods={fetchFoods}
            api={api}
            showToast={showToast}
          />
        )}

        {activeTab === "admin-orders" && (
          <AdminOrdersManager
            orders={orders}
            refreshOrders={fetchOrders}
            api={api}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>FeastFlow Kitchen & Delivery</strong>
            <p>Dynamic Food Ordering Web Application with full CRUD operations</p>
          </div>
          <div className="footer-links">
            <span onClick={() => setActiveTab("menu")}>Browse Menu</span>
            <span onClick={() => setActiveTab("my-orders")}>Track Orders</span>
            <span onClick={() => setActiveTab("admin-menu")}>Menu CRUD Admin</span>
            <span onClick={() => setActiveTab("admin-orders")}>Orders Admin</span>
          </div>
          <div className="footer-copyright">
            © 2026 FeastFlow Inc. Built for Cloud Computing & Full Stack Lab.
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        onOpenCheckout={(totals) => {
          setOrderTotals(totals);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        orderTotals={orderTotals}
        onOrderSuccess={handleOrderSuccess}
        api={api}
        showToast={showToast}
      />

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
