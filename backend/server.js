import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoute.js";



// App Config
const app = express();
const port = process.env.PORT || 3000;

// Connect DB
connectDB();

// Connect Cloudinary


// Middlewares
app.use(express.json());

// CORS Configuration (Specific Domain Allow Karo)
const allowedOrigins = [
  'http://localhost:5173',  
  'https://ecommerce-store-mern-lake.vercel.app'
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

// Api Endpoints
app.use("/api/user", userRouter);


// --- YE HAI WO NAYA CODE (Isay yahan add karo) ---
app.get("/api/health", (req, res) => {
  res.send("Server is Awake!");
});

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
