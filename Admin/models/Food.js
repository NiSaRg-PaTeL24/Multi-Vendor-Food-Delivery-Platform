import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this food'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  restaurant: {
    type: String,
    required: [true, 'Please provide the restaurant name'],
    maxlength: [60, 'Restaurant name cannot be more than 60 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide the price'],
    min: [0, 'Price cannot be negative'],
  },
  available: {
    type: Boolean,
    default: true,
  },
  appClient: {
    type: String,
    default: "Uber"
  }
});

// Check if the Food model exists before creating it to prevent 
// "Cannot overwrite model once compiled" errors
export default mongoose.models.Food || mongoose.model('Food', FoodSchema);