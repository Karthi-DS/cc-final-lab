import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, Sparkles, Check } from "lucide-react";

const IMAGE_PRESETS = [
  {
    name: "Burger",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Pizza",
    url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Curry / Bowl",
    url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Biryani / Rice",
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Tandoori / Skewers",
    url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Crispy Wings",
    url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Pasta",
    url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Dessert / Cake",
    url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Beverage / Drink",
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
  },
];

export default function DishFormModal({
  isOpen,
  onClose,
  dishToEdit,
  categories,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    imageUrl: "",
    isVegetarian: false,
    isAvailable: true,
    prepTime: "15-20 min",
    rating: 4.5,
    spiceLevel: "Medium",
    calories: 450,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (dishToEdit) {
      setFormData({
        name: dishToEdit.name || "",
        description: dishToEdit.description || "",
        price: dishToEdit.price !== undefined ? dishToEdit.price : "",
        category: dishToEdit.category || "Main Course",
        imageUrl: dishToEdit.imageUrl || "",
        isVegetarian: Boolean(dishToEdit.isVegetarian),
        isAvailable: dishToEdit.isAvailable !== undefined ? Boolean(dishToEdit.isAvailable) : true,
        prepTime: dishToEdit.prepTime || "15-20 min",
        rating: dishToEdit.rating || 4.5,
        spiceLevel: dishToEdit.spiceLevel || "Medium",
        calories: dishToEdit.calories || 450,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Main Course",
        imageUrl: IMAGE_PRESETS[0].url,
        isVegetarian: false,
        isAvailable: true,
        prepTime: "15-20 min",
        rating: 4.8,
        spiceLevel: "Medium",
        calories: 420,
      });
    }
    setError("");
  }, [dishToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePresetSelect = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Dish name is required.");
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid price greater than $0.00");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...formData,
        price: priceNum,
        rating: parseFloat(formData.rating) || 4.5,
        calories: parseInt(formData.calories, 10) || 400,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save dish.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="dish-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-standard">
          <div>
            <h2>{dishToEdit ? "Update Menu Dish" : "Add New Dish to Menu"}</h2>
            <p className="modal-sub">
              {dishToEdit
                ? "Modify ingredients, pricing, or availability for this item"
                : "Fill out the dish details to instantly introduce it to customers"}
            </p>
          </div>
          <button className="modal-close-round" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="form-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="dish-modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Dish Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Truffle Mushroom Risotto"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.10"
                name="price"
                placeholder="12.99"
                value={formData.price}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Prep Time</label>
              <input
                type="text"
                name="prepTime"
                placeholder="e.g. 15-20 min"
                value={formData.prepTime}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Spice Heat</label>
              <select
                name="spiceLevel"
                value={formData.spiceLevel}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Spicy">Spicy</option>
                <option value="Extra Spicy">Extra Spicy</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-input"
            />
            {/* Quick preset selector */}
            <div className="image-presets-row">
              <span className="preset-label">Quick Presets:</span>
              <div className="preset-chips">
                {IMAGE_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    className={`preset-btn ${formData.imageUrl === p.url ? "selected" : ""}`}
                    onClick={() => handlePresetSelect(p.url)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image preview */}
          {formData.imageUrl && (
            <div className="form-image-preview-wrap">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="form-image-preview"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="preview-caption">Live Photo Preview</span>
            </div>
          )}

          <div className="form-group">
            <label>Description & Ingredients *</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe flavors, ingredients, and garnish..."
              value={formData.description}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-switches-row">
            <label className="switch-card">
              <input
                type="checkbox"
                name="isVegetarian"
                checked={formData.isVegetarian}
                onChange={handleChange}
              />
              <div className="switch-text">
                <strong>Vegetarian / Plant-Based</strong>
                <span>Displays green veg badge</span>
              </div>
            </label>

            <label className="switch-card">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              <div className="switch-text">
                <strong>Available in Stock</strong>
                <span>Customers can order immediately</span>
              </div>
            </label>
          </div>

          <div className="modal-buttons-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : dishToEdit ? "Update Dish" : "Create Dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
