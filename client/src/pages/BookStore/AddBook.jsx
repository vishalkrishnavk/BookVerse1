import React, { useState } from "react";
import { axiosInstance } from "../../lib/axiosConfig.js";
import toast from "react-hot-toast";
import { handleFileUpload } from "../../utils";
import { BiImages } from "react-icons/bi";
import { Loading } from "../../components";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [Data, setData] = useState({
    title: "",
    author: "",
    ISBN: "",
    price: "",
    desc: "",
    language: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      setLoading(true);
      if (
        !file ||
        Data.title === "" ||
        Data.author === "" ||
        Data.ISBN === "" ||
        Data.price === "" ||
        Data.desc === "" ||
        Data.language === ""
      ) {
        toast.error("All fields are required");
        setLoading(false);
        return;
      }

      // Upload image first
      const imageUrl = await handleFileUpload(file);
      if (!imageUrl) {
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }

      // Send data with image URL
      const response = await axiosInstance.post(
        "/admin/new-book",
        { ...Data, url: imageUrl },
        { headers }
      );

      setData({
        title: "",
        author: "",
        ISBN: "",
        price: "",
        desc: "",
        language: "",
      });
      setFile(null);
      toast.success(response.data.message);
      navigate(`/get-book/${response.data.bookId}`);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bgColor px-12 py-8 h-auto">
      <h1 className="text-3xl md:text-5xl font-semibold text-ascent-1 mb-8">
        Add Book
      </h1>
      <div className="p-4 bg-primary rounded">
        <div>
          <label htmlFor="" className="text-ascent-2">
            Book Cover Image
          </label>
          <div className="flex items-center gap-2 mt-2">
            <label
              htmlFor="imgUpload"
              className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer bg-secondary p-2 rounded"
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="imgUpload"
                accept=".jpg, .png, .jpeg"
              />
              <BiImages />
              <span>{file ? file.name : "Upload Image"}</span>
            </label>
          </div>
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
        <div className="mt-4">
          <label htmlFor="" className="text-ascent-2">
            ISBN
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-secondary text-ascent-1 p-2 outline-none rounded"
            placeholder="ISBN of book"
            name="ISBN"
            required
            value={Data.ISBN}
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
          className="mt-4 px-6 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
          onClick={submit}
          disabled={loading}
        >
          {loading ? <Loading /> : "Add Book"}
        </button>
      </div>
    </div>
  );
};

export default AddBook;
