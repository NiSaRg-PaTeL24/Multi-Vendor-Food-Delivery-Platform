require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const { auth } = require('./config/auth0');
const auth0Middleware = require('./middleware/auth0Middleware');

// Routes
const auth0Routes = require("./routes/auth0Routes");
const homeRoutes = require("./routes/HomeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth0 middleware
app.use(auth);

// Routes
app.use(auth0Routes);

// Default route - allow guest access to home page
app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.redirect('/home');
  }
  res.redirect('/guest-home');
});

// Guest home page route
app.get("/guest-home", async (req, res) => {
  try {
    const Food = require('./models/Food');
    const foods = await Food.find();
    res.render("guest-home", { 
      foods: foods,
      isAuthenticated: false
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).send(`Error fetching food items: ${error.message}`);
  }
});

// Protected routes that require authentication
app.use("/", paymentRoutes);
app.use("/", orderRoutes);
app.use(homeRoutes);

// Replace old login route with Auth0 redirect
app.get('/login', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.redirect('/home');
  }
  res.redirect('/auth/login');
});

// Replace old register route with Auth0 redirect
app.get('/register', (req, res) => {
  res.redirect('/auth/login');
});

// Auth0 logout
app.get('/logout', (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.oidc.logout({ returnTo: process.env.AUTH0_BASE_URL });
});

// API endpoint for foods
app.get("/api/foods", async (req, res) => {
  try {
    const Food = require('./models/Food');
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food data" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});