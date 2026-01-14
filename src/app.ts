import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import authRoutes from "./routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

const initApp = (): Promise<Express> => {
    return new Promise((resolve, reject) => {
        if (!process.env.MONGODB_URI) {
            reject("MONGODB_URI is not defined");
        } else {
            mongoose
                .connect(process.env.MONGODB_URI)
                .then(() => {
                    console.log("Connected to MongoDB");
                    resolve(app);
                })
                .catch((err) => reject(err));
        }
    });
};

export default initApp;
