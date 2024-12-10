import mongoose from "mongoose";

/**
 * Connects to the MongoDB database.
 * @param uri The MongoDB connection string.
 */
export const connectDb = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};
