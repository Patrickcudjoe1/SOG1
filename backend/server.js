import express from "express";
import cors from "cors";
import "dotenv/config";
import paystackRoutes from "./routes/paystackroute.js";
import { testConnection } from "./db/index.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminroute.js";
import productRouter from "./routes/productroute.js";
import orderRouter from "./routes/orderroute.js";

const app = express();
const port = process.env.PORT || 4000;

connectCloudinary();

app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  process.env.VITE_FRONTEND_URL,
  process.env.VITE_ADMIN_URL,
  "http://localhost:3000", // Next.js default port
  "http://localhost:3001", // Alternative Next.js port
];

console.log(
  "Allowed CORS Origins:",
  allowedOrigins.length ? allowedOrigins : "none (will allow all in dev)"
);

const corsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("API is Working");
});

app.use("/api/paystack", paystackRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/orders", orderRouter);

const start = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`Server running on PORT: ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();