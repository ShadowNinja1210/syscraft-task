import express from "express";
import { login, authenticate, AuthenticatedRequest } from "./auth";
import { User } from "./schema";
import bcrypt from "bcrypt";

const router = express.Router();

// Login Route
router.post("/login", login);

// Protected Route Example (Role-Based Access)
router.get("/protected", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user; // Access user details from the authenticated middleware
  res.json({
    message: "You have accessed a protected route!",
    user,
  });
});

// Admin-Only Route
router.post("/admin/create-user", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user as { role: string };
  if (user?.role !== "Admin") {
    res.status(403).json({ message: "Forbidden: Admins only" });
    return;
  }

  const { username, email, password, role } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error });
  }
});

// User Signup Route
router.post("/create-user", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user with hashed password");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("User created successfully", newUser);

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error });
  }
});

// Test Route for Regular Users
router.get("/user/movies", authenticate, async (req: AuthenticatedRequest, res) => {
  const user = req.user; // Extract user details from the token
  console.log("User accessing movies route", user);
  res.json({
    message: "This route is accessible to authenticated users",
    user,
  });
});

export default router;
