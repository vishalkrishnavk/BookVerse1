import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  getAllBooks,
  getRecentBooks,
  getSingleBook,
  rateBook,
  Search,
} from "../controllers/bookController.js";
const router = express.Router();

router.get("/get-all-books", getAllBooks);
router.get("/get-recent-books", getRecentBooks);
router.get("/get-book/:id", getSingleBook);
router.get("/search", Search);

router.put("/rateBook", userAuth, rateBook);
router.get("/rateBook", userAuth, rateBook);
export default router;
