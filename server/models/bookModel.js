import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    urlS: {
      type: String,
    },
    urlL: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Books = mongoose.model("Book", bookSchema);
export default Books;
