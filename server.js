// server.js

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Body Parser Middleware
app.use(express.json());

// MongoDB Atlas Connection
mongoose
  .connect(
    "mongodb+srv://surajcodes:surajcodes@cluster0.ojyoqnf.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// User Model
const User = mongoose.model("User", {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

// Signup API
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Signin API
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
