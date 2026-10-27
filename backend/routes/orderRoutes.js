const express = require("express");
const { Op } = require("sequelize");
const Order = require("../models/Order");

const router = express.Router();

// GET all orders with optional status filter and search
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status && status !== "All") {
      where.orderStatus = status;
    }

    if (search && search.trim() !== "") {
      where[Op.or] = [
        { orderNumber: { [Op.like]: `%${search.trim()}%` } },
        { customerName: { [Op.like]: `%${search.trim()}%` } },
        { customerPhone: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const orders = await Order.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
});

// GET single order by ID or orderNumber
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    let order;

    if (!isNaN(identifier)) {
      order = await Order.findByPk(identifier);
    }

    if (!order) {
      order = await Order.findOne({ where: { orderNumber: identifier } });
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order", details: error.message });
  }
});

// POST place a new customer order (CRUD - Create)
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      items,
      paymentMethod,
      specialInstructions,
    } = req.body;

    if (!customerName || customerName.trim() === "") {
      return res.status(400).json({ error: "Customer name is required" });
    }
    if (!customerPhone || customerPhone.trim() === "") {
      return res.status(400).json({ error: "Customer phone number is required" });
    }
    if (!deliveryAddress || deliveryAddress.trim() === "") {
      return res.status(400).json({ error: "Delivery address is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    // Compute subtotal from items
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity, 10) || 1;
      return sum + price * qty;
    }, 0);

    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const deliveryFee = subtotal >= 35 ? 0.0 : 2.99;
    const totalAmount = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

    // Unique readable order number e.g. ORD-6842
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(-2)}`;

    const newOrder = await Order.create({
      orderNumber,
      customerName: customerName.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : "",
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
      orderStatus: "Pending",
      specialInstructions: specialInstructions ? specialInstructions.trim() : "",
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ error: "Failed to place order", details: error.message });
  }
});

// PATCH update order status (CRUD - Update Status)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status", details: error.message });
  }
});

// PUT update full order details (CRUD - Update)
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      orderStatus,
      paymentMethod,
      specialInstructions,
    } = req.body;

    await order.update({
      customerName: customerName !== undefined ? customerName.trim() : order.customerName,
      customerEmail: customerEmail !== undefined ? customerEmail.trim() : order.customerEmail,
      customerPhone: customerPhone !== undefined ? customerPhone.trim() : order.customerPhone,
      deliveryAddress: deliveryAddress !== undefined ? deliveryAddress.trim() : order.deliveryAddress,
      orderStatus: orderStatus !== undefined ? orderStatus : order.orderStatus,
      paymentMethod: paymentMethod !== undefined ? paymentMethod : order.paymentMethod,
      specialInstructions:
        specialInstructions !== undefined ? specialInstructions.trim() : order.specialInstructions,
    });

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(400).json({ error: "Failed to update order", details: error.message });
  }
});

// DELETE cancel / remove order (CRUD - Delete)
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await order.destroy();
    res.json({ message: "Order removed successfully", id: req.params.id });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order", details: error.message });
  }
});

module.exports = router;
