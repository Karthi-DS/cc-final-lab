const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const FoodItem = db.define("FoodItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Item name cannot be empty" },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: { args: [0.01], msg: "Price must be greater than 0" },
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Main Course",
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
  },
  isVegetarian: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  prepTime: {
    type: DataTypes.STRING,
    defaultValue: "15-25 min",
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 4.5,
  },
  spiceLevel: {
    type: DataTypes.STRING,
    defaultValue: "Medium",
  },
  calories: {
    type: DataTypes.INTEGER,
    defaultValue: 420,
  },
});

module.exports = FoodItem;
