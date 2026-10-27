const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Order = db.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Customer name is required" },
    },
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Customer phone is required" },
    },
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Delivery address is required" },
    },
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tax: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deliveryFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: "Cash on Delivery",
  },
  orderStatus: {
    type: DataTypes.STRING,
    defaultValue: "Pending", // Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
});

module.exports = Order;
