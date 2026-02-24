import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import movieRoutes from "./routes/movieRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// === 🔥 MERI GHALTI KA FIX (CORS POLICY) ===
// 'origin: "*"' lagane se ab Vercel ka koi bhi link block nahi hoga!
app.use(cors({
    origin: "*", 
    credentials: true
}));

app.use(express.json());

// Database Connect (Simple tareeka)
connectDB();

// Routes
app.use("/api/movies", movieRoutes);

app.get('/ping', (req, res) => res.send('ok'));

app.get("/", (req, res) => {
  res.send("Movie API is Running Successfully! 🚀");
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

// Vercel Export
export default app;