import User from "../models/userModel.js";
import Books from "../models/bookModel.js";

export const addFav = async (req, res) => {
  const { userId } = req.body.user;
  const { id } = req.params;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    const book = await Books.findById(id);
    const alreadyFavBook = user.favourites.includes(id);
    if (alreadyFavBook)
      return res.status(409).json({ message: "Book already exists" });
    await User.findByIdAndUpdate(userId, { $push: { favourites: id } });
    return res
      .status(200)
      .json({ message: "Book added to favourites succesfully" });
  } catch (error) {
    console.log("Error in adding book to fav", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const removeFav = async (req, res) => {
  const { userId } = req.body.user;
  const { id } = req.params;
  console.log(userId);
  const bookId = id;
  try {
    const user = await User.findById(userId);
    const alreadyFavBook = user.favourites.includes(bookId);
    if (alreadyFavBook) {
      await User.findByIdAndUpdate(userId, { $pull: { favourites: bookId } });
      return res
        .status(200)
        .json({ message: "Book removed from fav succesfully" });
    } else {
      return res.status(404).json({ message: "Book not in fav" });
    }
  } catch (error) {
    console.log("Error in removing book from fav", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const getFavs = async (req, res) => {
  const { userId } = req.body.user;
  try {
    const user = await User.findById(userId).populate("favourites");
    const favBooks = user.favourites;
    return res.status(200).json({ favBooks });
  } catch (error) {
    console.log("error in showing fav books", error);
    res.status(500).json("Internal server error");
  }
};
