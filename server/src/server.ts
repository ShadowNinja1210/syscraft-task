import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes";
import apiRoutes from "./apiRoutes";
import { connectDb } from "./lib/utils";

dotenv.config();
const app = express();

app.use(express.json()); // Parse JSON request bodies

app.use("/auth", authRoutes); // Mount the routes under the `/auth` prefix

app.use("/api", apiRoutes); // Mount the routes under the `/api` prefix

const uri = process.env.MONGO_URI as string;
connectDb(uri); // Connect to the database

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
