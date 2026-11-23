const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth0Middleware = require("../middleware/auth0Middleware");

// Use Auth0 middleware for all routes
router.use(auth0Middleware);

// Checkout Route
router.post("/checkout", async (req, res) => {
    try {
        const { cart } = req.body;
        const newOrder = new Order({
            userId: req.user._id,
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Checkout failed" });
    }
});

// Fetch Orders for Orders Page
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.render("orders", { orders, user: req.user }); // Pass user to the template
    } catch (error) {
        res.status(500).send("Error fetching orders");
    }
});

// Cancel Order Route - Updated to change status instead of deleting
router.post("/cancel-order/:id", async (req, res) => {
    try {
      const orderId = req.params.id;
      const userId = req.user._id;
  
      // Find the order and ensure it belongs to the logged-in user
      const order = await Order.findOne({ _id: orderId, userId });
  
      if (!order) {
        return res.status(404).json({ error: "Order not found or unauthorized" });
      }
  
      // Update the order status to 'cancelled' instead of deleting
      order.status = 'cancelled';
      await order.save();
  
      res.status(200).json({ message: "Order canceled successfully" });
    } catch (error) {
      console.error("Error canceling order:", error);
      res.status(500).json({ error: "Failed to cancel order" });
    }
  });
  
module.exports = router;