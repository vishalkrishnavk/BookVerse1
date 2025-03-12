import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  addFav,
  getFavs,
  removeFav,
} from "../controllers/favouritesController.js";
const router = express.Router();

router.put("/add/:id", userAuth, addFav);
router.put("/remove/:id", userAuth, removeFav);
router.get("/", userAuth, getFavs);

export default router;
