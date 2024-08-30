import express from "express";
import cookieParser from "cookie-parser";
import app from "./app.js";
import authRouter from "./controllers/auth.js";
import cors from "cors";
import mongoose from "./connection.js"
import "dotenv/config";

app.use(express.json())
app.use(cookieParser())

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions))

app.use("/auth", authRouter);
app.use("/", authRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
