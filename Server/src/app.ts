import express, {
  Response as ExResponse,
  Request as ExRequest,
  ErrorRequestHandler,
} from "express";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { rateLimit as expressRateLimit } from "express-rate-limit";
import { RegisterRoutes } from "./routes/routes";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(express.static(path.join(__dirname, "../public")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});


const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
const defaultLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});
app.use(defaultLimiter);
/// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
// Connection logs
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db...");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected...");
});
app.get("/health/check", (req, res, next) => {
  res.status(200).send();
});
RegisterRoutes(app);
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
