import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import YAML from "yaml";

const app = express();

app.use(express.json());

const swaggerPath = path.resolve(process.cwd(), "./src/swagger/swagger.yaml");
const swaggerFile = fs.readFileSync(swaggerPath, "utf8");
const swaggerDocument = YAML.parse(swaggerFile);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
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
