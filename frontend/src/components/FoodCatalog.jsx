import React, { useState } from "react";
import {
  Search,
  Star,
  Clock,
  Flame,
  Plus,
  Minus,
  Check,
  Filter,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function FoodCatalog({
  foods,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  vegOnly,
  setVegOnly,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  addToCart,
  loading,
}) {
  const [quantities, setQuantities] = useState({});
  const [activeItemModal, setActiveItemModal] = useState(null);

  const handleQtyChange = (foodId, delta) => {
    setQuantities((prev) => {
      const current = prev[foodId] || 1;
      const updated = Math.max(1, current + delta);
      return { ...prev, [foodId]: updated };
    });
  };

  const getQty = (foodId) => quantities[foodId] || 1;

  const handleAdd = (food) => {
    const qty = getQty(food.id);
    addToCart(food, qty);
    // Reset quantity back to 1
    setQuantities((prev) => ({ ...prev, [food.id]: 1 }));
  };

  return (
    <div className="catalog-wrapper">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-tag">
            <Sparkles size={16} /> Fast 25-Min Delivery & Artisanal Taste
          </div>
          <h1 className="hero-title">
            Crafted with Passion, <br />
            <span>Delivered to Your Doorstep.</span>
          </h1>
          <p className="hero-desc">
            Explore chef-curated appetizers, sizzling gourmet mains, artisanal wood-fired pizzas, 
            and heavenly desserts prepared freshly upon your order.
          </p>

          {/* Search bar inside hero */}
          <div className="hero-search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search burgers, pasta, butter chicken, desserts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter and Category Controls */}
      <div className="catalog-controls">
        {/* Category Selector Pills */}
        <div className="categories-list">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters and Sorting bar */}
        <div className="filters-bar">
          <div className="toggle-filters">
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
              />
              <span className="veg-indicator-dot"></span>
              <span className="label-text">Pure Veg Only</span>
            </label>

            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span className="label-text">Available Now</span>
            </label>
          </div>

          <div className="sort-wrapper">
            <span className="sort-label">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="catalog-loading">
          <div className="spinner"></div>
          <p>Loading fresh dishes...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="empty-catalog">
          <div className="empty-icon">🍽️</div>
          <h3>No dishes found matching your criteria</h3>
          <p>Try clearing your search query or adjusting your filters.</p>
          <button
            className="btn-secondary"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setVegOnly(false);
              setInStockOnly(false);
              setSortBy("featured");
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="food-grid">
          {foods.map((food) => {
            const isSoldOut = !food.isAvailable;
            const currentQty = getQty(food.id);

            return (
              <div
                key={food.id}
                className={`food-card ${isSoldOut ? "sold-out" : ""}`}
              >
                {/* Image & Badges */}
                <div
                  className="card-media"
                  onClick={() => setActiveItemModal(food)}
                >
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  {isSoldOut && (
                    <div className="sold-out-badge">Currently Sold Out</div>
                  )}

                  {/* Veg / Non-Veg badge */}
                  <div
                    className={`dietary-badge ${food.isVegetarian ? "veg" : "non-veg"}`}
                    title={food.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}
                  >
                    <span className="dot"></span>
                    <span>{food.isVegetarian ? "VEG" : "NON-VEG"}</span>
                  </div>

                  {/* Rating */}
                  <div className="rating-badge">
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span>{food.rating ? food.rating.toFixed(1) : "4.5"}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="card-body">
                  <div className="card-meta-row">
                    <span className="card-category">{food.category}</span>
                    <div className="card-specs">
                      <span className="spec-item">
                        <Clock size={13} /> {food.prepTime || "15-20 min"}
                      </span>
                      {food.spiceLevel && food.spiceLevel !== "Mild" && (
                        <span className="spec-item spice" title={`Spice: ${food.spiceLevel}`}>
                          <Flame size={13} /> {food.spiceLevel}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3
                    className="card-title"
                    onClick={() => setActiveItemModal(food)}
                    title={food.name}
                  >
                    {food.name}
                  </h3>
                  <p className="card-desc">{food.description}</p>

                  {/* Price & Action Row */}
                  <div className="card-footer">
                    <div className="price-tag">
                      <span className="currency">$</span>
                      <span className="amount">{parseFloat(food.price).toFixed(2)}</span>
                    </div>

                    {!isSoldOut ? (
                      <div className="add-controls">
                        <div className="qty-picker">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleQtyChange(food.id, -1)}
                            disabled={currentQty <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-number">{currentQty}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleQtyChange(food.id, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn-add-cart"
                          onClick={() => handleAdd(food)}
                        >
                          <ShoppingBag size={16} />
                          <span>Add</span>
                        </button>
                      </div>
                    ) : (
                      <button className="btn-unavailable" disabled>
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Dish Detail Modal */}
      {activeItemModal && (
        <div className="modal-backdrop" onClick={() => setActiveItemModal(null)}>
          <div
            className="dish-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-media-header">
              <img
                src={activeItemModal.imageUrl}
                alt={activeItemModal.name}
                className="modal-cover-img"
              />
              <button
                className="modal-close-round"
                onClick={() => setActiveItemModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-inner-content">
              <div className="detail-tags-row">
                <span
                  className={`dietary-badge ${activeItemModal.isVegetarian ? "veg" : "non-veg"}`}
                >
                  <span className="dot"></span>
                  {activeItemModal.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}
                </span>
                <span className="detail-cat-pill">{activeItemModal.category}</span>
                <span className="detail-rating-pill">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  {activeItemModal.rating || 4.8} / 5
                </span>
              </div>

              <h2>{activeItemModal.name}</h2>
              <p className="detail-full-desc">{activeItemModal.description}</p>

              <div className="nutrition-specs-grid">
                <div className="spec-box">
                  <span className="spec-box-title">Prep Time</span>
                  <span className="spec-box-val">{activeItemModal.prepTime || "15-20 min"}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-box-title">Spice Heat</span>
                  <span className="spec-box-val">{activeItemModal.spiceLevel || "Medium"}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-box-title">Calories</span>
                  <span className="spec-box-val">{activeItemModal.calories || 420} kcal</span>
                </div>
                <div className="spec-box">
                  <span className="spec-box-title">Status</span>
                  <span
                    className="spec-box-val"
                    style={{ color: activeItemModal.isAvailable ? "#16a34a" : "#dc2626" }}
                  >
                    {activeItemModal.isAvailable ? "In Stock" : "Sold Out"}
                  </span>
                </div>
              </div>

              <div className="modal-action-footer">
                <div className="modal-price">
                  <span className="currency">$</span>
                  <span className="amount">{parseFloat(activeItemModal.price).toFixed(2)}</span>
                </div>
                {activeItemModal.isAvailable ? (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      addToCart(activeItemModal, 1);
                      setActiveItemModal(null);
                    }}
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                ) : (
                  <button className="btn-unavailable" disabled>
                    Currently Sold Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
