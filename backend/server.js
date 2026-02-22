import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import movieRoutes from "./routes/movieRoutes.js";

// App Config
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors({
    // Vercel frontend domain ko allow karo (Optional but good practice)
    origin: ["https://on-flix-movies.vercel.app", "http://localhost:5173"], 
    credentials: true
}));
// Health Check & Test Routes
app.get("/api/health", (req, res) => {
  res.send("Movie Server is Awake! 🚀");
});
// Api Endpoints
app.use("/api/movies", movieRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Movie API is Running Successfully! 🚀");
});

// === 🔥 THE REAL FIX: Server Start hone se pehle DB ka WAIT karo ===

const startServer = async () => {
  try {
    // 1. Pehle DB Connect karo aur uska intezar (AWAIT) karo
    await connectDB();
    
    // 2. Jab DB pakka connect ho jaye, tab hi server listen karega
    app.listen(port, () => {
      console.log(`✅ Database Connected! Server started at port ${port}`);
    });

  } catch (error) {
    console.error("❌ Failed to connect to Database. Server shutting down.", error);
    process.exit(1); // Agar DB connect na ho to server band kardo
  }
};

// Function ko call karo
startServer();

// Vercel Export
export default app;