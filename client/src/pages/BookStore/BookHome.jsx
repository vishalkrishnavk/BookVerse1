import React from "react";
import { useEffect } from "react";
import Hero from "../../components/BookStore/Hero";
import RecentlyAdded from "../../components/BookStore/RecentlyAdded";
import Recommend from "../../components/BookStore/Recommend";
const BookHome = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-bgColor text-ascent-1 px-10 py-8">
      <Hero />
      <RecentlyAdded />
      <Recommend />
    </div>
  );
};

export default BookHome;
