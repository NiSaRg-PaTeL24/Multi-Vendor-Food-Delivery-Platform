const express = require("express");
const homeController = require("../controllers/homeController");
const auth0Middleware = require("../middleware/auth0Middleware");

const router = express.Router();

// Protected route - needs authentication
router.get("/home", auth0Middleware, homeController.homePage);

module.exports = router;