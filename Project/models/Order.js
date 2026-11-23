// models/Order.js in main application
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            id: String,
            restaurant: String,
            name: String,
            price: Number,
            quantity: Number,
        }
    ],
    subtotal: Number,
    tax: Number,
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    total: Number,
    paymentId: String,
    status: {
        type: String,
        enum: ['pending', 'paid', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;