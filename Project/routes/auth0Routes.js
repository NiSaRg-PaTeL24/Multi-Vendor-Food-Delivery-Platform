// routes/auth0Routes.js
const express = require('express');
const router = express.Router();
const auth0Middleware = require('../middleware/auth0Middleware');

// Simplified callback route
router.get('/auth/callback', (req, res) => {
  // Auth0 automatically handles authentication at this point
  // Just need to redirect to home
  res.redirect('/home');
});

// Add a route to manually trigger authentication if needed
router.get('/auth/login-redirect', (req, res) => {
  res.oidc.login({ returnTo: '/home' });
});

// Profile route - example of a protected route
router.get('/profile', auth0Middleware, (req, res) => {
  res.render('profile', {
    user: req.user,
    auth0User: req.oidc.user
  });
});

module.exports = router;