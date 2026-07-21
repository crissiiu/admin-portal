import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`[user-service] is running on http://localhost:${PORT}`);
});
