import express from "express";
import {
  getUserProfile,
  myProfile,
  updateUserProfile,
} from "../controller/user.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", isAuth, myProfile);
router.get("/:userId", isAuth, getUserProfile);
router.put("/update/profile", isAuth, updateUserProfile);

export default router;
