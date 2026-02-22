import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
    console.log(`>> Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Database Connection Function
const connectDB = async () => {
  // === MAGIC LINE: Agar pehle se connect hai, to wapis connect mat karo ===
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB connection pehle se active hai.");
    return;
  }

  try {
    // Naya connection banao (Serverless settings ke sath)
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Agar 5 second mein connect na ho to error do
      maxPoolSize: 10, // Max 10 connections allow karo
    });
    console.log("🚀 MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
};

// 👉 YAHAN HUMNE FUNCTION KO CHALAYA HAI (Execute kiya hai) 👈
connectDB();

app.get('/', (req, res) => {
  res.send('Mera Backend Vercel Par Successfully Chal Raha Hai! 🚀');
});

// Routes
app.use('/api/movies', movieRoutes);

// Server Start (For Localhost)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on Port ${PORT}`);
});

// 👉 VERCEL SERVERLESS KE LIYE YEH LINE BOHOT ZAROORI HAI 👈
export default app;