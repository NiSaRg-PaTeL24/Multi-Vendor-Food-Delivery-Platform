// controllers/paymentController.js for main application
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Rule = require('../models/Rule'); // Import the shared Rule model

exports.createPaymentIntent = async (req, res) => {
  try {
    const { cart } = req.body;
    
    // Get current pricing rules directly from database
    const rules = await Rule.getActiveRules();
    
    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Calculate tax using the current tax rate
    const tax = subtotal * (rules.taxPercentage / 100);
    
    // Initialize total
    let total = subtotal + tax;
    
    // Apply discount if eligible
    let discount = 0;
    if (subtotal >= rules.discountThreshold) {
      discount = subtotal * (rules.discountPercentage / 100);
      total -= discount;
    }
    
    // Apply delivery charge if applicable
    let deliveryCharge = 0;
    if (subtotal < rules.deliveryChargeThreshold) {
      deliveryCharge = rules.deliveryCharge;
      total += deliveryCharge;
    }
    
    // Convert to cents for Stripe
    const amount = Math.round(total * 100);
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        discount: discount.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2)
      }
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      amount: total.toFixed(2),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      discount: discount.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      taxRate: rules.taxPercentage,
      discountThreshold: rules.discountThreshold,
      discountPercentage: rules.discountPercentage
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Payment setup failed' });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId, cart } = req.body;
    
    // Get current pricing rules
    const rules = await Rule.getActiveRules();
    
    // Verify the payment was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Calculate subtotal
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      // Calculate tax using current tax rate
      const tax = subtotal * (rules.taxPercentage / 100);
      
      // Initialize total
      let total = subtotal + tax;
      
      // Apply discount if eligible
      let discount = 0;
      if (subtotal >= rules.discountThreshold) {
        discount = subtotal * (rules.discountPercentage / 100);
        total -= discount;
      }
      
      // Apply delivery charge if applicable
      let deliveryCharge = 0;
      if (subtotal < rules.deliveryChargeThreshold) {
        deliveryCharge = rules.deliveryCharge;
        total += deliveryCharge;
      }
      
      // Create the order with all pricing components
      const newOrder = new Order({
        userId: req.user._id,
        items: cart,
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        deliveryCharge: deliveryCharge,
        total: total,
        paymentId: paymentIntentId,
        status: 'paid'
      });

      await newOrder.save();
      res.status(201).json({ success: true, orderId: newOrder._id });
    } else {
      res.status(400).json({ error: 'Payment was not successful' });
    }
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};