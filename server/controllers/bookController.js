import Books from "../models/bookModel.js";
import Ratings from "../models/ratingModel.js";

export const newBook = async (req, res) => {
  try {
    const newBook = new Books({
      title: req.body.title,
      author: req.body.author,
      ISBN: req.body.ISBN,
      price: req.body.price,
      url: req.body.url,
      desc: req.body.desc,
      language: req.body.language,
    });
    await newBook.save();
    return res
      .status(201)
      .json({ message: "New book created succesfully", bookId: newBook._id });
  } catch (error) {
    console.log("Error in creating a new book", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Books.findByIdAndUpdate(
      bookId,
      {
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        url: req.body.url,
        desc: req.body.desc,
        language: req.body.language,
      },
      {
        new: true,
      }
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    console.log("Error in updating book", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Books.findByIdAndDelete(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json({ message: "Book deleted succesfully" });
  } catch (error) {
    console.log("Error in deleting the book", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10
    const skip = (page - 1) * limit;

    const books = await Books.find()
      .sort({ createdAt: -1 }) // Sort by latest books
      .skip(skip)
      .limit(limit);

    // Check if there are more books to load
    const totalBooks = await Books.countDocuments();
    const hasMore = skip + limit < totalBooks;

    return res.status(200).json({ books, hasMore });
  } catch (error) {
    console.error("Error in getting info of all books", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecentBooks = async (req, res) => {
  try {
    const books = await Books.find().sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({ books });
  } catch (error) {
    console.log("Error in getting info of all books", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Books.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    const { ISBN } = book;
    const ratings = await Ratings.aggregate([
      { $match: { ISBN } },
      {
        $group: {
          _id: "$ISBN",
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);
    const avgRating = ratings.length > 0 ? ratings[0].avgRating.toFixed(1) : 0;
    const totalRatings = ratings.length > 0 ? ratings[0].totalRatings : 0;
    console.log(avgRating, totalRatings);
    return res.status(200).json({ book, avgRating, totalRatings });
  } catch (error) {
    console.log("Error in finding book", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ books: [] });

    const books = await Books.find({
      title: { $regex: query, $options: "i" },
    }).limit(10);

    return res.json({ books });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rateBook = async (req, res) => {
  const { rating } = req.body;
  const { ISBN } = req.query;
  const { userId } = req.body.user;
  const ratingOutOf10 = rating * 2;

  try {
    if (req.method === "GET") {
      const userRating = await Ratings.findOne({ ISBN, userID: userId });
      return res
        .status(200)
        .json({ rating: userRating ? userRating.rating : 0 });
    }

    const book = await Books.findOne({ ISBN });
    if (!book) return res.status(404).json({ message: "Book not found" });
    const existingRating = await Ratings.findOne({ ISBN, userID: userId });
    if (existingRating) {
      existingRating.rating = ratingOutOf10;
      await existingRating.save();
    } else {
      await Ratings.create({ ISBN, userID: userId, rating: ratingOutOf10 });
    }
    return res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.log("Error in rating book", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
