import React from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axiosConfig.js";
import toast from "react-hot-toast";
const BookCard = ({ image, title, author, price, bookid, fav }) => {
  const headers = {
    bookid: bookid,
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const id = bookid;
  const removeFromFavourite = async () => {
    try {
      const response = await axiosInstance.put(
        `/favourites/remove/${id}`,
        {},
        { headers }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full bg-secondary rounded-lg p-4 shadow-sm">
      <Link to={`/get-book/${id}`} className="">
        <div className="w-full flex items-center justify-center bg-primary/40 rounded-lg">
          <img src={image} alt="book" className="h-40 object-cover" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-ascent-1 line-clamp-2">
          {title}
        </h1>
        <p className="mt-2 text-ascent-2 font-medium">by {author}</p>
        <p className="mt-2 text-ascent-1 font-semibold text-xl">₹ {price}</p>
      </Link>
      {fav === true && (
        <button
          className="mt-4 bg-red-100 w-full rounded-lg text-red-600 py-2 font-semibold hover:bg-red-200 transition-all duration-300"
          onClick={removeFromFavourite}
        >
          Remove from favourites
        </button>
      )}
    </div>
  );
};

export default BookCard;
