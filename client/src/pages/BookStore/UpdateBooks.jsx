import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axiosConfig.js";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const UpdateBooks = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      const res = await axiosInstance.get(`/books/get-book/${id}`);
      setData({
        url: res.data.book.url,
        title: res.data.book.title,
        author: res.data.book.author,
        price: res.data.book.price,
        desc: res.data.book.desc,
        language: res.data.book.language,
      });
    };
    fetch();
  }, []);
  const headers = {
    bookid: id,
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };
  const update = async () => {
    try {
      if (
        Data.url === "" ||
        Data.title === "" ||
        Data.author === "" ||
        Data.price === "" ||
        Data.desc === "" ||
        Data.language === ""
      ) {
        toast.error("All fields are required");
      } else {
        const response = await axiosInstance.put(
          `/admin/update-book/${id}`,
          Data,
          { headers }
        );
        toast.success(response.data.message);
        history(`/get-book/${id}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-bgColor px-12 py-8 h-auto">
      <h1 className="text-3xl md:text-5xl font-semibold text-ascent-1 mb-8">
        Update Book
      </h1>
      <div className="p-4 bg-primary rounded">
        <div>
          <label htmlFor="" className="text-ascent-2">
            Image
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-secondary text-ascent-1 p-2 outline-none rounded"
            placeholder="url of image"
            name="url"
            required
            value={Data.url}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-ascent-2">
            Title of book
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-secondary text-ascent-1 p-2 outline-none rounded"
            placeholder="title of book"
            name="title"
            required
            value={Data.title}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-ascent-2">
            Author of book
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-secondary text-ascent-1 p-2 outline-none rounded"
            placeholder="author of book"
            name="author"
            required
            value={Data.author}
            onChange={change}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label htmlFor="" className="text-ascent-2">
              Language
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-secondary text-ascent-1 p-2 outline-none rounded"
              placeholder="language of book"
              name="language"
              required
              value={Data.language}
              onChange={change}
            />
          </div>
          <div className="w-3/6">
            <label htmlFor="" className="text-ascent-2">
              Price
            </label>
            <input
              type="number"
              className="w-full mt-2 bg-secondary text-ascent-1 p-2 outline-none rounded"
              placeholder="price of book"
              name="price"
              required
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-ascent-2">
            Description of book
          </label>
          <textarea
            className="w-full mt-2 bg-secondary text-ascent-1 p-2 outline-none rounded"
            rows="5"
            placeholder="description of book"
            name="desc"
            required
            value={Data.desc}
            onChange={change}
          />
        </div>

        <button
          className="mt-4 px-6 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
          onClick={update}
        >
          Update Book
        </button>
      </div>
    </div>
  );
};

export default UpdateBooks;
