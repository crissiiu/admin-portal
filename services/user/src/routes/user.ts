import express from "express";
import {
  getUserProfile,
  myProfile,
  udpateProfilePic,
  udpateProfileResumer,
  updateUserProfile,
} from "../controller/user.js";
import { isAuth } from "../middleware/auth.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router();

router.get("/me", isAuth, myProfile);
router.get("/:userId", isAuth, getUserProfile);
router.put("/update/profile", isAuth, updateUserProfile);
router.put("/update/pic", isAuth, uploadFile, udpateProfilePic);
router.put("/update/resumer", isAuth, uploadFile, udpateProfileResumer);

export default router;
