import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


export default app;
