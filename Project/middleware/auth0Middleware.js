// middleware/auth0Middleware.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const auth0Middleware = async (req, res, next) => {
  try {
    // Check if user is authenticated with Auth0
    if (!req.oidc.isAuthenticated()) {
      // Redirect to Auth0 login
      return res.oidc.login({ returnTo: req.originalUrl });
    }

    const auth0UserId = req.oidc.user.sub;
    const email = req.oidc.user.email;
    const name = req.oidc.user.name || req.oidc.user.nickname || email.split('@')[0];
    
    // Check if user exists in our database
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { authProviderId: auth0UserId, authProvider: 'auth0' }
      ]
    });
    
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        username: name,
        email: email,
        // Generate a random password - user won't use this
        password: require('crypto').randomBytes(16).toString('hex'),
        authProvider: 'auth0',
        authProviderId: auth0UserId,
        profilePicture: req.oidc.user.picture || null
      });
      
      await user.save();
    }
    
    // Set user in request
    req.user = user;
    
    // Generate JWT for our internal auth system
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '1d'
    });
    
    // Set cookie for our internal auth system
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + (process.env.JWT_EXPIRES_DAYS || 1) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });
    
    next();
  } catch (error) {
    console.error('Auth0 middleware error:', error);
    return res.oidc.login({ returnTo: req.originalUrl });
  }
};

module.exports = auth0Middleware;