import { axiosInstance } from "../../lib/axiosConfig.js";
import React, { useEffect, useState } from "react";
import BookCard from "../../components/BookStore/BookCard";
import Loading from "./../../components/Loading.jsx";
const Favourite = () => {
  const [FavBooks, setFavBooks] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
    const fetch = async () => {
      const res = await axiosInstance.get("/favourites/", {
        headers,
      });
      setFavBooks(res.data.favBooks);
    };
    fetch();
  }, [FavBooks]);

  return (
    <div className="bg-bgColor min-h-screen p-4">
      {!FavBooks && <Loading />}
      {FavBooks && FavBooks.length === 0 && (
        <div className="h-[80vh] p-4 text-ascent-1">
          <div className="h-[100%] flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-ascent-1 mb-8">
              No favourite book
            </h1>
            <img src="./star.png" alt="" className="h-[20vh] mb-8" />
          </div>
        </div>
      )}
      {FavBooks && (
        <div className="">
          <h1 className="text-3xl md:text-5xl font-semibold text-ascent-1 mb-8">
            Favourite books
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {FavBooks.map((items, i) => (
              <BookCard
                bookid={items._id}
                image={items.url}
                title={items.title}
                author={items.author}
                price={items.price}
                key={i}
                fav={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourite;
