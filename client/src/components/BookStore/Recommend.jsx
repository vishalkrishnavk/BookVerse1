import React, { useEffect, useState } from "react";
import BookCard from "./BookCard.jsx";
import { axiosInstance } from "../../lib/axiosConfig.js";
import axios from "axios";
const Recommend = () => {
  const [Books, setBooks] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  /* useEffect(() => {
    const fetch = async () => {
      const res = await axiosInstance.get("http://localhost:3001/api/order/", {
        headers,
      });
      const latestOrder = res.data.ordersData[0];
      console.log(latestOrder);
      if (latestOrder) {
        const response = await axios.get(`http://localhost:5001/recommend`, {
          params: { title: latestOrder.books.title },
        });
        console.log(response);
        setBooks(response.data.recommendations);
      }
    };
    fetch();
  }, []); */

  useEffect(() => {
    const fetch = async () => {
      try {
        // Fetch user orders
        const orderRes = await axiosInstance.get("/order/", { headers });
        const latestOrder = orderRes.data.ordersData?.[0]?.books?.title;

        // Fetch user favorites
        const favRes = await axiosInstance.get("/favourites/", { headers });
        const favoriteBook = favRes.data.favBooks?.[0]?.title;
        console.log(favoriteBook);

        // Fetch user cart
        const cartRes = await axiosInstance.get("/cart/", { headers });
        const cartBook = cartRes.data.cart?.[0]?.title;
        console.log(cartBook);

        // Determine which book to use for recommendation
        const recommendTitle = latestOrder || favoriteBook || cartBook;
        console.log(recommendTitle);

        if (recommendTitle) {
          const response = await axios.get("http://localhost:5001/recommend", {
            params: { title: recommendTitle },
          });

          setBooks(response.data.recommendations);
          console.log(Books);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetch();
  }, []);

  return (
    <>
      {Books && (
        <div className="bg-secondary px-12 py-8">
          <h1 className="text-ascent-1 text-3xl">Recommended books</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {Books.map((items, i) => (
              <BookCard
                bookid={items._id}
                image={items.url}
                title={items.title}
                author={items.author}
                price={items.price}
                key={i}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Recommend;
