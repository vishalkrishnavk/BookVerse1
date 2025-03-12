import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axiosConfig.js";
import BookCard from "../../components/BookStore/BookCard.jsx";
import Loading from "./../../components/Loading.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { debounce } from "lodash";

const GetAllBooks = () => {
  const [books, setBooks] = useState([]); // Store books
  const [page, setPage] = useState(1); // Track page number
  const [hasMore, setHasMore] = useState(true); // Check if more books exist
  const [searchTerm, setSearchTerm] = useState(""); // Store search input
  const [searchResults, setSearchResults] = useState([]); // Store API search results
  const [isSearching, setIsSearching] = useState(false); // Track search state
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axiosInstance.get(
        `/books/get-all-books?page=${page}&limit=10`
      );

      setBooks((prevBooks) => [...prevBooks, ...response.data.books]); // Append new books
      setHasMore(response.data.hasMore); // Check if more books exist
      setPage(page + 1); // Increment page
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const searchBook = debounce(async (query) => {
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
    }
    setIsSearching(true);
    try {
      const response = await axiosInstance.get(`/books/search?q=${query}`);
      setSearchResults(response.data.books);
    } catch (error) {
      console.log("Error in searching books", error);
    }
    setIsSearching(false);
  }, 500);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchBook(value);
  };

  return (
    <div className="bg-bgColor h-auto mt-8 px-12">
      <form className="max-w-md mx-auto mt-8">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-ascent-1 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-ascent-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full p-4 ps-10 text-sm text-ascent-1 border border-ascent-2/20 rounded-lg bg-secondary focus:ring-blue focus:border-blue"
            placeholder="Search Books..."
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue hover:bg-blue/80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>

      {searchTerm && (
        <div className="bg-secondary p-4 mt-2 rounded-md">
          <h5 className="text-ascent-1 mb-2">
            {isSearching ? (
              <Loading />
            ) : (
              <h4 className="text-center text-ascent-1 font-medium">
                Search Results
              </h4>
            )}
          </h5>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {searchResults.map((item, i) => (
                <BookCard
                  key={i}
                  bookid={item._id}
                  title={item.title}
                  author={item.author}
                  price={item.price}
                  image={
                    <LazyLoadImage
                      src={item.url}
                      alt={item.title}
                      effect="blur"
                      className="w-full h-auto"
                    />
                  }
                />
              ))}
            </div>
          ) : (
            <h2 className="text-2xl text-center font-bold text-ascent-1">
              Not Found
            </h2>
          )}
        </div>
      )}

      <InfiniteScroll
        dataLength={books.length}
        next={fetchBooks}
        hasMore={hasMore}
        loader={<Loading />}
        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 my-8 gap-4"
      >
        {books.map((item, i) => (
          <div key={i}>
            <BookCard
              bookid={item._id}
              title={item.title}
              author={item.author}
              price={item.price}
              image={item.url}
            />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default GetAllBooks;
