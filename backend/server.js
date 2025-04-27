const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

// Models
const User = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  date: { type: Date, default: Date.now },
});

// Helper function to check if the email is a Google email
const isGoogleEmail = (email) => {
  return email.endsWith('@gmail.com') || email.endsWith('@google.com');
};

// Auth APIs

// Signup API
app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  if (!isGoogleEmail(email)) {
    return res.status(400).json({ success: false, error: "Please use a valid Google email address (e.g., Gmail)." });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, error: "User already exists" });
  }

  const user = new User({
    name: username,
    email: email,
    password: password,
  });

  await user.save();
  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// Login API
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || user.password !== req.body.password)
    return res.status(401).json({ success: false, error: "Invalid credentials" });

  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// Middleware to verify JWT
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get all users (protected)
app.get("/users", fetchUser, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } });
  res.json(users);
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
