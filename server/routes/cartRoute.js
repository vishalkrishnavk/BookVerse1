import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  addCart,
  removeCart,
  viewCart,
} from "../controllers/cartController.js";

const router = express.Router();
router.put("/add/:id", userAuth, addCart);
router.put("/remove/:id", userAuth, removeCart);
router.get("/", userAuth, viewCart);

export default router;
