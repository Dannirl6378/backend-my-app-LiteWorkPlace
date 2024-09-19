const express = require("express");
const { UserModel } = require("./models");
const { hashPassword, comparePassword } = require("./PasswordUtility");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use." });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "Internal server error during registration." });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Optionally, generate a JWT token here for session management

    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error during login." });
  }
});

// Get All Users
router.get("/all", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users." });
  }
});

// Get User by Email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update User Data (PATCH instead of PUT for partial updates)
router.patch("/update", async (req, res) => {
  const { email, akceCalander, Quilltext, todoList } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update only the provided fields
    if (akceCalander) user.akceCalander = akceCalander;
    if (Quilltext) user.Quilltext = Quilltext;
    if (todoList) user.todoList = todoList;

    await user.save();

    res.json({ message: "User data updated successfully." });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Internal server error during update." });
  }
});

module.exports = router;
