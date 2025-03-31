import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  placeOrder,
  orderHistory,
  verifyPayment,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/place-order", userAuth, placeOrder);
router.get("/", userAuth, orderHistory);
router.get("/verify-payment", userAuth, verifyPayment);

export default router;
