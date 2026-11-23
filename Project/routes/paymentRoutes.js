// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// Create payment intent
router.post("/create-payment-intent", authMiddleware, paymentController.createPaymentIntent);

// Payment success webhook
router.post("/payment-success", authMiddleware, paymentController.paymentSuccess);
module.exports = router;