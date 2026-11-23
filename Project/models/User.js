const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
      trim: true,
      minlength: [3, "Please enter correct username. username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    // Auth provider fields
    authProvider: {
      type: String,
      enum: ['local', 'auth0'],
      default: 'local'
    },
    authProviderId: {
      type: String,
      default: null
    },
    profilePicture: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// Hash password before saving - only for local users
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.authProvider !== 'local') return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password - only for local users
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // For auth0 users, password check is skipped
  if (this.authProvider !== 'local') {
    return false;
  }
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;