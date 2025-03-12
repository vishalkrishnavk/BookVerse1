import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  deleteBook,
  newBook,
  updateBook,
} from "../controllers/bookController.js";
import { getAllOrder, updateOrder } from "../controllers/orderController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const router = express.Router();

router.post("/new-book", userAuth, verifyAdmin, newBook);
router.put("/update-book/:bookId", userAuth, verifyAdmin, updateBook);
router.delete("/delete-book/:bookId", userAuth, verifyAdmin, deleteBook);

router.get("/get-all-orders", userAuth, verifyAdmin, getAllOrder);
router.put("/update-order/:id", userAuth, verifyAdmin, updateOrder);

export default router;
