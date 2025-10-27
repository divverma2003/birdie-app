import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { ENV } from "./lib/env.js";
import connectMongoDB from "./lib/connectMongoDB.js";
const app = express();
const PORT = ENV.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
