import express from "express";
import uploadFile from "./middleware/multer.js";
import authRoutes from "./routes/auth.js";
const app = express();
app.use(express.json());
app.use("/api/auth", uploadFile, authRoutes);
export default app;
