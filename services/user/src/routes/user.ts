import express from "express";
import {
  addSkillToUser,
  deleteSkillFromUser,
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
router.post("/skill/add", isAuth, addSkillToUser);
router.delete("/skill/delete", isAuth, deleteSkillFromUser);

export default router;
