const axios = require('axios'); // Import axios
const Rule = require('../models/Rule');

exports.homePage = async (req, res) => {
  try {
    // Fetch food data from the third-party API
    const uber = await axios.get('http://localhost:5000/api/foods');
    const doordash = await axios.get('http://localhost:7000/api/foods');

    const rules = await Rule.getActiveRules()

    const foods5000 = uber.data.data || [];
    const foods7000 = doordash.data || [];

    // console.log('API Response:', response.data);
    
    // Extract the foods array from the response
    // The API likely returns { success: true, data: [...] }
    // const foodsArray = response.data.data || [];
    const foodsArray = [...foods5000 , ...foods7000 ];
    
    
    // Render the home page with the fetched food data and user information
    res.render("home", {
      user: req.user, // Pass the user object to the template
      username: req.user.username, // Pass the username 
      foods: foodsArray, // Passing food details as single string array
      stripePublicKey: process.env.STRIPE_PUBLISHABLE_KEY,
      taxRate: rules.taxPercentage 
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).send(`Error fetching food items: ${error.message}`);
  }
};