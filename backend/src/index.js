dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/db.js";

const app=express();
const port=3000;
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/message",messageRoutes);

app.listen(port,()=>{
    console.log("Server is Running on port "+port);
    connectDb();
});