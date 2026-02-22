import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Movie Database Connected Successfully 🚀");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Database connection error:", err);
  });

  try {
    // Apne Vercel environment variable ka naam yahan likho (e.g., MONGO_URI)
    await mongoose.connect(`${process.env.MONGO_URI}/movies`);
  } catch (error) {
    console.error("Connection attempt failed:", error);
  }
};

export default connectDB;