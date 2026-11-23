// config/auth0.js
const { auth } = require('express-openid-connect');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Auth0 config with updated routes
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientAuthMethod: 'client_secret_post',
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  },
  routes: {
    login: '/auth/login',
    callback: '/auth/callback',
    postLogoutRedirect: '/'
  },
  afterCallback: (req, res, session) => {
    // This runs after successful authentication
    // Return the session to continue
    return session;
  }
};

// JWKS client to verify Auth0 JWT tokens
const client = jwksClient({
  jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`
});

// Function to get the signing key
function getSigningKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// JWT token verification middleware
const verifyJWT = (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/auth/login');
  }

  const token = req.oidc.idToken;
  
  if (!token) {
    return res.redirect('/auth/login');
  }

  jwt.verify(token, getSigningKey, {
    algorithms: ['RS256'],
    issuer: process.env.AUTH0_ISSUER_BASE_URL
  }, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.redirect('/auth/login');
    }
    
    req.user = {
      _id: decoded.sub, // Auth0 user ID
      email: decoded.email,
      username: decoded.nickname || decoded.name
    };
    
    next();
  });
};

module.exports = {
  auth: auth(config),
  verifyJWT,
  getSigningKey
};