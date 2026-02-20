import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js'; // .js lagana mat bhoolna

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Mera Backend Vercel Par Successfully Chal Raha Hai! 🚀');
});
// Logger
app.use((req, res, next) => {
    console.log(`>> Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use('/api/movies', movieRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on Port ${PORT}`);
});