import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js'; // .js lagana mat bhoolna

dotenv.config();

const app = express();

// Middlewares

app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'https://on-flix-movies-a7we.vercel.app/',
  'https://on-flix-movies.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // Console mein pata chalega kon block hua
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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