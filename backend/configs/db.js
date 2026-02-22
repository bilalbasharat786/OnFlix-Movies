import mongoose from "mongoose";

const connectDB = async () => {
  // === MAGIC LINE: Agar pehle se connect hai, to wapis connect mat karo ===
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB connection pehle se active hai.");
    return;
  }

  try {
    // Naya connection banao (Serverless settings ke sath)
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Agar 5 second mein connect na ho to error do (lamba wait na karo)
      maxPoolSize: 10, // Max 10 connections allow karo
    });
    console.log("🚀 MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
};

export default connectDB;