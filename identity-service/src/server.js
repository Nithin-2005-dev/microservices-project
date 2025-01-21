import dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "./utils/logger.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => logger.info("connected to database successfully"))
  .catch((e) => logger.error("Mongo connection error", e));
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`Received ${req.method} to ${req.url}`);
  logger.info(`Request body , ${req.body}`);
  next();
});
