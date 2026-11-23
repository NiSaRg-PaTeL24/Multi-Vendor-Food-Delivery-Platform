require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve CSS files

app.set("view engine", "ejs");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Food Model
const Food = mongoose.model("DoorDashFood", new mongoose.Schema({
  name: String,
  restaurant: String,
  price: Number,
  available: Boolean,
  appClient: String
}));

// Home Page (List Foods)
app.get("/", async (req, res) => {
  const foods = await Food.find();
  res.render("layout", { content: "index", foods });
});

// Add Food Page
app.get("/add-food", (req, res) => {
  res.render("layout", { content: "add-food" });
});

// Handle Food Submission
app.post("/add-food", async (req, res) => {
  const { name, restaurant, price, available } = req.body;
  const newFood = new Food({ 
    name,
    restaurant, 
    price, 
    available: available === "on", // Convert checkbox value
    appClient: "DoorDash" // Default App client
  });
  await newFood.save();
  res.redirect("/");
});

// Delete Food
app.post("/delete-food/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// API Endpoint to Fetch Food Data (JSON)
app.get("/api/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods); // Return food data as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food data" });
  }
});

// Start server with default server 7000 if .env file not works
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`DoorDash Server running on port http://localhost:${PORT}`));