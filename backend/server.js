import express from "express";
import cors from "cors";
import "dotenv/config"; // Yeh foran variables load karega
import connectDB from "./configs/db.js"; // Nayi DB file
import movieRoutes from "./routes/movieRoutes.js";

// App Config
const app = express();
const port = process.env.PORT || 5000;

// Connect DB (Bilkul wese hi jaise tumhari working site mein hai)
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Api Endpoints
app.use("/api/movies", movieRoutes);

// Health Check & Test Routes
app.get("/api/health", (req, res) => {
  res.send("Movie Server is Awake! 🚀");
});

app.get("/", (req, res) => {
  res.send("Movie API WORKING PERFECTLY");
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

// Vercel ke liye Export (Zaroori)
export default app;