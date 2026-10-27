const express = require("express");
const { Op } = require("sequelize");
const FoodItem = require("../models/FoodItem");

const router = express.Router();

// GET all food items with filtering, search, and sorting
router.get("/", async (req, res) => {
  try {
    const { category, search, isVegetarian, isAvailable, sortBy } = req.query;
    const where = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (search && search.trim() !== "") {
      where[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    if (isVegetarian !== undefined && isVegetarian !== "") {
      where.isVegetarian = isVegetarian === "true";
    }

    if (isAvailable !== undefined && isAvailable !== "") {
      where.isAvailable = isAvailable === "true";
    }

    let order = [["id", "DESC"]];
    if (sortBy === "price-asc") order = [["price", "ASC"]];
    else if (sortBy === "price-desc") order = [["price", "DESC"]];
    else if (sortBy === "rating-desc") order = [["rating", "DESC"]];
    else if (sortBy === "name-asc") order = [["name", "ASC"]];

    const foods = await FoodItem.findAll({ where, order });
    res.json(foods);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Failed to retrieve food items", details: error.message });
  }
});

// GET single food item by ID
router.get("/:id", async (req, res) => {
  try {
    const food = await FoodItem.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food item", details: error.message });
  }
});

// POST add a new dish (CRUD - Create)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      imageUrl,
      isVegetarian,
      isAvailable,
      prepTime,
      rating,
      spiceLevel,
      calories,
    } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Dish name is required" });
    }
    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ error: "A valid positive price is required" });
    }
    if (!category || category.trim() === "") {
      return res.status(400).json({ error: "Category is required" });
    }

    const defaultImage =
      isVegetarian
        ? "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";

    const newFood = await FoodItem.create({
      name: name.trim(),
      description: description ? description.trim() : "Delicious chef special freshly prepared with authentic ingredients.",
      price: parseFloat(price),
      category: category.trim(),
      imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl.trim() : defaultImage,
      isVegetarian: Boolean(isVegetarian),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      prepTime: prepTime || "15-20 min",
      rating: rating ? parseFloat(rating) : 4.5,
      spiceLevel: spiceLevel || "Medium",
      calories: calories ? parseInt(calories, 10) : 400,
    });

    res.status(201).json(newFood);
  } catch (error) {
    console.error("Error creating food item:", error);
    res.status(400).json({ error: "Failed to create food item", details: error.message });
  }
});

// PUT update food item details (CRUD - Update)
router.put("/:id", async (req, res) => {
  try {
    const food = await FoodItem.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }

    const {
      name,
      description,
      price,
      category,
      imageUrl,
      isVegetarian,
      isAvailable,
      prepTime,
      rating,
      spiceLevel,
      calories,
    } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({ error: "Dish name cannot be blank" });
    }
    if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    await food.update({
      name: name !== undefined ? name.trim() : food.name,
      description: description !== undefined ? description.trim() : food.description,
      price: price !== undefined ? parseFloat(price) : food.price,
      category: category !== undefined ? category.trim() : food.category,
      imageUrl: imageUrl !== undefined && imageUrl.trim() !== "" ? imageUrl.trim() : food.imageUrl,
      isVegetarian: isVegetarian !== undefined ? Boolean(isVegetarian) : food.isVegetarian,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : food.isAvailable,
      prepTime: prepTime !== undefined ? prepTime : food.prepTime,
      rating: rating !== undefined ? parseFloat(rating) : food.rating,
      spiceLevel: spiceLevel !== undefined ? spiceLevel : food.spiceLevel,
      calories: calories !== undefined ? parseInt(calories, 10) : food.calories,
    });

    res.json(food);
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(400).json({ error: "Failed to update food item", details: error.message });
  }
});

// PATCH quick toggle availability
router.patch("/:id/toggle-availability", async (req, res) => {
  try {
    const food = await FoodItem.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.json({ message: "Availability toggled", food });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle availability", details: error.message });
  }
});

// DELETE remove a dish (CRUD - Delete)
router.delete("/:id", async (req, res) => {
  try {
    const food = await FoodItem.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }

    await food.destroy();
    res.json({ message: "Food item deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).json({ error: "Failed to delete food item", details: error.message });
  }
});

module.exports = router;
