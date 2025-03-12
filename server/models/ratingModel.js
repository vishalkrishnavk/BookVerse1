import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  userID: {
    type: String,
  },
  ISBN: {
    type: String,
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    /* required: true, */
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Ratings = mongoose.model("Rating", ratingSchema);

export default Ratings;
