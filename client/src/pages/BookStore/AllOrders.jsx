import React, { useEffect, useState } from "react";
import Loading from "./../../components/Loading.jsx";
import { FaUserLarge } from "react-icons/fa6";
import { axiosInstance } from "../../lib/axiosConfig.js";
import { Link } from "react-router-dom";
import { IoOpenOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import SeeUserData from "./SeeUserData";
import toast from "react-hot-toast";
const AllOrders = () => {
  const [itemData, setItemData] = useState();
  const [OrderHistory, setOrderHistory] = useState();
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState();
  const [Options, setOptions] = useState("hidden");
  const [EditableDiv, setEditableDiv] = useState(-1);
  const [Values, setValues] = useState({ status: "" });
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
    const fetch = async () => {
      const res = await axiosInstance.get("/admin/get-all-orders", { headers });
      setOrderHistory(res.data.userData);
    };
    fetch();
  }, [OrderHistory]);

  const change = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };
  const submitChanges = async (i) => {
    const id = OrderHistory[i]._id;
    const response = await axiosInstance.put(
      `/admin/update-order/${id}`,
      Values,
      { headers }
    );
    toast.success(response.data.message);
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="flex-1 h-full px-4">
          {!OrderHistory && <Loading />}
          {OrderHistory && OrderHistory.length === 0 && (
            <div className="h-[80vh] p-4 text-ascent-1">
              <div className="h-[100%] flex flex-col items-center justify-center">
                <h1 className="text-5xl font-semibold text-ascent-2 mb-8">
                  No Order History
                </h1>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png"
                  alt=""
                  className="h-[20vh] mb-8"
                />
              </div>
            </div>
          )}
          {OrderHistory && OrderHistory.length > 0 && (
            <div className="h-full p-0 md:p-4 text-ascent-1">
              <h1 className="text-3xl md:text-5xl font-semibold text-ascent-1 mb-8">
                All Orders History
              </h1>
              <div className="mt-4 bg-primary w-full rounded py-2 px-4 flex gap-2">
                <div className="w-[3%]">
                  <h1 className="text-center">Sr.</h1>
                </div>
                <div className="w-[40%] md:w-[22%]">
                  <h1 className="">Books</h1>
                </div>
                <div className="w-0 md:w-[45%] hidden md:block">
                  <h1 className="">Description</h1>
                </div>
                <div className="w-[17%] md:w-[9%]">
                  <h1 className="">Price</h1>
                </div>
                <div className="w-[30%] md:w-[16%]">
                  <h1 className="">Status</h1>
                </div>
                <div className="w-[10%] md:w-[5%]">
                  <h1 className="">
                    <FaUserLarge />
                  </h1>
                </div>
              </div>
              {OrderHistory.map((items, i) => (
                <div className="bg-primary w-full rounded py-2 px-4 flex gap-2 hover:bg-secondary transition-all duration-300 cursor-pointer">
                  <div className="w-[3%]">
                    <h1 className="text-center text-ascent-1">{i + 1}</h1>
                  </div>
                  <div className="w-[40%] md:w-[22%]">
                    <Link
                      to={`/view-book-details/${items.books._id}`}
                      className="text-blue hover:text-blue/80"
                    >
                      {items.books.title}
                    </Link>
                  </div>
                  <div className="w-0 md:w-[45%] hidden md:block">
                    <h1 className="text-ascent-2">
                      {items.books.desc.slice(0, 50)} ...
                    </h1>
                  </div>
                  <div className="w-[17%] md:w-[9%]">
                    <h1 className="text-ascent-1">₹ {items.books.price}</h1>
                  </div>
                  <div className="w-[30%] md:w-[16%]">
                    <h1 className="font-semibold">
                      <button
                        className={`${
                          Options === "hidden" ? "block" : "hidden"
                        } hover:scale-105`}
                        onClick={() => setEditableDiv(i)}
                      >
                        {items.status === "Order placed" ? (
                          <div className="text-yellow-500">{items.status}</div>
                        ) : items.status === "Canceled" ? (
                          <div className="text-red-500">{items.status}</div>
                        ) : (
                          <div className="text-green-500">{items.status}</div>
                        )}
                      </button>
                      <div
                        className={`${
                          EditableDiv === i ? "block" : "hidden"
                        } flex mt-4`}
                      >
                        <select
                          name="status"
                          id=""
                          className="bg-primary text-ascent-1"
                          onChange={change}
                        >
                          {[
                            "Order placed",
                            "Out for delivery",
                            "Delivered",
                            "Canceled",
                          ].map((items, i) => (
                            <option value={items} key={i}>
                              {items}
                            </option>
                          ))}
                        </select>
                        <button
                          className="text-green-500 hover:text-pink-600 mx-2"
                          onClick={() => {
                            setEditableDiv(-1);
                            submitChanges(i);
                          }}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    </h1>
                  </div>
                  <div className="w-[10%] md:w-[5%]">
                    <button
                      className="text-xl text-ascent-1 hover:text-orange-500"
                      onClick={() => {
                        setuserDiv("fixed");
                        setuserDivData(items.user);
                        setItemData(items);
                      }}
                    >
                      <IoOpenOutline />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={setuserDiv}
          item={itemData}
        />
      )}
    </div>
  );
};

export default AllOrders;
