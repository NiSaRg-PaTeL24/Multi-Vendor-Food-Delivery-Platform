import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  taxPercentage: {
    type: Number,
    default: 13.0, // Default 13% tax
    min: 0,
    max: 30
  },
  discountThreshold: {
    type: Number,
    default: 100.0 // Orders above $100 qualify for discount
  },
  discountPercentage: {
    type: Number,
    default: 10.0, // 10% discount
    min: 0,
    max: 50
  },
  deliveryChargeThreshold: {
    type: Number,
    default: 15.0 // Orders below $15 incur delivery charges
  },
  deliveryCharge: {
    type: Number,
    default: 3.99,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create a static method to ensure we have only one document for rules
ruleSchema.statics.getActiveRules = async function() {
  const rules = await this.find();
  if (rules.length === 0) {
    return await this.create({});
  }
  return rules[0];
};

// Check if the Rule model exists before creating it
export default mongoose.models.Rule || mongoose.model('Rule', ruleSchema);