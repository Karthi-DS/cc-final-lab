import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Utensils,
  CheckCircle,
  XCircle,
  DollarSign,
  Layers,
  Flame,
} from "lucide-react";
import DishFormModal from "./DishFormModal";

export default function AdminMenuManager({
  foods,
  categories,
  refreshFoods,
  api,
  showToast,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dishToEdit, setDishToEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleOpenAdd = () => {
    setDishToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dish) => {
    setDishToEdit(dish);
    setIsModalOpen(true);
  };

  const handleSaveDish = async (dishData) => {
    if (dishToEdit) {
      await api.updateFood(dishToEdit.id, dishData);
      showToast({ type: "success", message: `Updated "${dishData.name}" successfully!` });
    } else {
      await api.createFood(dishData);
      showToast({ type: "success", message: `Added "${dishData.name}" to the menu!` });
    }
    await refreshFoods();
  };

  const handleDeleteDish = async (dish) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${dish.name}"?`)) {
      return;
    }
    try {
      setDeletingId(dish.id);
      await api.deleteFood(dish.id);
      showToast({ type: "info", message: `Dish "${dish.name}" deleted.` });
      await refreshFoods();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Failed to delete dish." });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStock = async (dish) => {
    try {
      setTogglingId(dish.id);
      await api.toggleFoodAvailability(dish.id);
      showToast({
        type: "success",
        message: `"${dish.name}" is now marked as ${
          dish.isAvailable ? "Sold Out" : "In Stock"
        }.`,
      });
      await refreshFoods();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Failed to toggle stock status." });
    } finally {
      setTogglingId(null);
    }
  };

  // Metrics
  const totalCount = foods.length;
  const inStockCount = foods.filter((f) => f.isAvailable).length;
  const soldOutCount = totalCount - inStockCount;
  const vegCount = foods.filter((f) => f.isVegetarian).length;

  const filtered = foods.filter((f) => {
    const matchesCat = categoryFilter === "All" || f.category === categoryFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="admin-menu-wrapper">
      {/* Metrics Banner */}
      <div className="admin-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
            <Utensils size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-val">{totalCount}</span>
            <span className="metric-label">Total Dishes</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ backgroundColor: "#ecfdf5", color: "#16a34a" }}>
            <CheckCircle size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-val">{inStockCount}</span>
            <span className="metric-label">Available In-Stock</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
            <XCircle size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-val">{soldOutCount}</span>
            <span className="metric-label">Sold Out / Hidden</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}>
            <span style={{ fontSize: "18px" }}>🌱</span>
          </div>
          <div className="metric-info">
            <span className="metric-val">{vegCount}</span>
            <span className="metric-label">Vegetarian Dishes</span>
          </div>
        </div>
      </div>

      {/* Action and Filter Header */}
      <div className="admin-table-header">
        <div className="header-left">
          <h2>Menu Catalog Management</h2>
          <p>Add new dishes, update pricing, descriptions, and toggle inventory in real time</p>
        </div>

        <button className="btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="admin-toolbar">
        <div className="toolbar-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search dishes by name or ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="toolbar-select"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="table-responsive-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Price</th>
              <th>Dietary</th>
              <th>Inventory Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-cell">
                  No dishes found matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((dish) => (
                <tr key={dish.id}>
                  {/* Dish name & thumb */}
                  <td>
                    <div className="table-dish-cell">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="table-dish-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100";
                        }}
                      />
                      <div className="table-dish-details">
                        <span className="table-dish-title">{dish.name}</span>
                        <span className="table-dish-desc">{dish.description}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="cat-badge">{dish.category}</span>
                  </td>

                  {/* Price */}
                  <td>
                    <span className="table-price">
                      ${parseFloat(dish.price).toFixed(2)}
                    </span>
                  </td>

                  {/* Dietary Tag */}
                  <td>
                    <span
                      className={`dietary-badge mini ${
                        dish.isVegetarian ? "veg" : "non-veg"
                      }`}
                    >
                      <span className="dot"></span>
                      {dish.isVegetarian ? "Veg" : "Non-Veg"}
                    </span>
                  </td>

                  {/* Stock Toggle */}
                  <td>
                    <button
                      className={`stock-toggle-pill ${
                        dish.isAvailable ? "in-stock" : "sold-out"
                      }`}
                      onClick={() => handleToggleStock(dish)}
                      disabled={togglingId === dish.id}
                      title="Click to toggle availability"
                    >
                      <span className="status-dot"></span>
                      <span>
                        {togglingId === dish.id
                          ? "Updating..."
                          : dish.isAvailable
                          ? "In Stock"
                          : "Sold Out"}
                      </span>
                    </button>
                  </td>

                  {/* Action buttons (Edit & Delete) */}
                  <td style={{ textAlign: "right" }}>
                    <div className="table-actions">
                      <button
                        className="btn-action edit"
                        onClick={() => handleOpenEdit(dish)}
                        title="Edit Dish Details"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => handleDeleteDish(dish)}
                        disabled={deletingId === dish.id}
                        title="Delete Dish"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit Dish */}
      <DishFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dishToEdit={dishToEdit}
        categories={categories}
        onSave={handleSaveDish}
      />
    </div>
  );
}
