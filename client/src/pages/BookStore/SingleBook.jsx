import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axiosConfig";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loading } from "../../components";
import { FaCartShopping } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import toast from "react-hot-toast";
import Rating from "@mui/material/Rating";

const SingleBook = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [Book, setBook] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [Ratings, setRatings] = useState(0);
  const [Total, setTotal] = useState(0);
  const role = localStorage.getItem("role");

  const headers = {
    bookId: id,
    userId: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const submitRating = async () => {
    try {
      const res = await axiosInstance.put(
        `/books/rateBook`,
        {
          rating: Number(userRating),
        },
        {
          params: {
            ISBN: Book.ISBN,
          },
          headers,
        }
      );
      toast.success("Rating Submitted");
    } catch (error) {
      console.log("Error in submitting rating", error);
      toast.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBookDetails = async () => {
      try {
        const res = await axiosInstance.get(`/books/get-book/${id}`);
        const ratingRes = await axiosInstance.get(`/books/rateBook`, {
          params: {
            ISBN: res.data.book.ISBN,
          },
          headers,
        });

        setBook(res.data.book);
        const userRatingValue = ratingRes.data.rating || 0;
        setUserRating(Number((userRatingValue / 2).toFixed(1)));

        setRatings(res.data.avgRating);
        setTotal(res.data.totalRatings || 0);
      } catch (error) {
        console.log("Error in fetching book", error);
        toast.error("Error fetching book details");
      }
    };
    fetchBookDetails();
  }, []);

  const addToFavourite = async () => {
    try {
      const response = await axiosInstance.put(
        `/favourites/add/${id}`,
        {},
        { headers }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    try {
      const response = await axiosInstance.put(
        `/cart/add/${id}`,
        {},
        { headers }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const deleteBook = async () => {
    try {
      const response = await axiosInstance.delete(`/admin/delete-book/${id}`, {
        headers,
      });
      toast.success(response.data.message);
      history("/all-books");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(Book);

  return (
    <>
      {!Book && <Loading />}
      {Book && (
        <div className="bg-bgColor min-h-screen px-12 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section */}
            <div className="w-full lg:w-3/6">
              <div className="flex flex-col md:flex-row items-start justify-around bg-primary rounded-lg px-4 py-8 gap-4">
                <img
                  src={Book.url}
                  alt="book"
                  className="h-[50vh] md:h-[70vh] rounded-lg shadow-lg"
                />
                {localStorage.getItem("id") && (
                  <div className="w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start items-center mt-4 md:mt-0 gap-4">
                    {role !== "admin" && (
                      <>
                        <button
                          className="bg-secondary p-3 rounded-full text-2xl font-semibold hover:bg-secondary/80 transition-all duration-300 flex items-center"
                          onClick={addToFavourite}
                        >
                          <GoHeartFill className="text-ascent-1" />
                        </button>
                        <button
                          className="bg-blue text-white p-3 rounded-full text-2xl font-semibold flex items-center hover:bg-blue/80 transition-all duration-300"
                          onClick={addToCart}
                        >
                          <FaCartShopping className="me-4 md:me-0" />
                          <span className="block md:hidden">Add to cart</span>
                        </button>
                      </>
                    )}
                    {role === "admin" && (
                      <>
                        <Link
                          to={`/update-book/${id}`}
                          className="bg-secondary p-3 rounded-full text-2xl font-semibold hover:bg-secondary/80 transition-all duration-300 flex items-center"
                        >
                          <FaRegEdit className="text-ascent-1" />
                        </Link>
                        <button
                          className="bg-red-500 text-white p-3 rounded-full text-2xl font-semibold flex items-center hover:bg-red-600 transition-all duration-300"
                          onClick={deleteBook}
                        >
                          <MdDelete className="me-4 md:me-0" />
                          <span className="block md:hidden">Delete book</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-3/6 bg-primary rounded-lg p-8">
              <h1 className="text-4xl text-ascent-1 font-semibold mb-2">
                {Book.title}
              </h1>
              <p className="text-ascent-2 text-lg mb-4">by {Book.author}</p>

              <div className="bg-secondary rounded-lg p-4 mb-6">
                <p className="text-ascent-2 text-lg leading-relaxed">
                  {Book.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4 bg-secondary rounded-lg p-4">
                <GrLanguage className="text-ascent-1 text-xl" />
                <span className="text-ascent-2 text-lg">{Book.language}</span>
              </div>

              <div className="bg-secondary rounded-lg p-4 mb-6">
                <p className="text-ascent-1 text-3xl font-semibold">
                  Price: ₹{Book.price}
                </p>
              </div>

              {/* User Rating Section */}
              <div className="bg-secondary rounded-lg p-6 mb-6">
                <p className="text-ascent-1 text-2xl font-semibold mb-4">
                  Your Rating
                </p>
                <Rating
                  name="simple-controlled"
                  value={userRating}
                  className="scale-125"
                  onChange={(event, newRating) => {
                    setUserRating(newRating);
                  }}
                />
                <p className="text-ascent-2 mt-2 mb-4">{userRating} out of 5</p>
                <button
                  onClick={submitRating}
                  className="w-fit px-6 py-2 bg-blue text-white rounded-lg hover:bg-blue/80 transition-all duration-300"
                >
                  Submit Rating
                </button>
              </div>

              {/* Average Rating Section */}
              <div className="bg-secondary rounded-lg p-6">
                <p className="text-ascent-1 text-2xl font-semibold mb-4">
                  Average Rating
                </p>
                <div className="flex items-center gap-4">
                  {Ratings === "No Ratings yet" ? (
                    <p className="text-ascent-2 text-lg">{Ratings}</p>
                  ) : (
                    <>
                      <Rating
                        name="read-only"
                        value={Number(Ratings) / 2}
                        className="scale-125"
                        readOnly
                        precision={0.1}
                      />
                      <p className="text-ascent-2">
                        {(Number(Ratings) / 2).toFixed(1)} out of 5 ({Total}{" "}
                        ratings)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleBook;
