dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv";
import { connectDb } from "./lib/db.js";

const app=express();
const port=3000;

app.use("/api/v1/auth",authRoutes);

app.listen(port,()=>{
    console.log("Server is Running on port "+port);
    connectDb();
});