import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  getMessages,
  getUsersForSideBar,
  markMsgAsRead,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", userAuth, getUsersForSideBar);
router.get("/:id", userAuth, getMessages);
router.post("/:id", userAuth, sendMessage);
router.put("/mark-as-read/:userId", userAuth, markMsgAsRead);

export default router;
