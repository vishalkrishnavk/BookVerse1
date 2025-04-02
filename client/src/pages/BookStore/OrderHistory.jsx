import React, { useEffect, useState } from "react";
import Loading from "./../../components/Loading.jsx";
import { axiosInstance } from "../../lib/axiosConfig.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const OrderHistory = () => {
  const [OrderHist, setOrderHist] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/order/", {
          headers,
        });
        setOrderHist(res.data.ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch order history");
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-bgColor">
      {!OrderHist && <Loading />}
      {OrderHist && OrderHist.length === 0 && (
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
      {OrderHist && OrderHist.length > 0 && (
        <div className="min-h-screen p-0 md:p-4 text-ascent-1">
          <h1 className="text-3xl md:text-5xl font-semibold text-ascent-1 mb-8">
            Your Order History
          </h1>
          <div className="mt-4 bg-primary w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%]">
              <h1 className="text-center">Sr.</h1>
            </div>
            <div className="w-[22%]">
              <h1 className="">Books</h1>
            </div>
            <div className="w-[45%]">
              <h1 className="">Description</h1>
            </div>
            <div className="w-[9%]">
              <h1 className="">Price</h1>
            </div>
            <div className="w-[16%]">
              <h1 className="">Status</h1>
            </div>
            <div className="w-none md:w-[5%] hidden md:block">
              <h1 className="">Mode</h1>
            </div>
          </div>
          {OrderHist.map((order, i) => {
            // Check if books exists and has the required properties
            if (!order.books) return null;

            return (
              <div
                key={order._id || i}
                className="bg-primary w-full rounded py-2 px-4 flex gap-4 hover:bg-secondary transition-all duration-300 cursor-pointer"
              >
                <div className="w-[3%]">
                  <h1 className="text-center text-ascent-1">{i + 1}</h1>
                </div>
                <div className="w-[22%]">
                  <Link
                    to={`/view-book-details/${order.books._id}`}
                    className="text-blue hover:text-blue/80"
                  >
                    {order.books.title}
                  </Link>
                </div>
                <div className="w-[45%]">
                  <h1 className="text-ascent-2">
                    {order.books.desc
                      ? `${order.books.desc.slice(0, 50)}...`
                      : "No description available"}
                  </h1>
                </div>
                <div className="w-[9%]">
                  <h1 className="text-ascent-1">₹ {order.books.price}</h1>
                </div>
                <div className="w-[16%]">
                  <h1 className="font-semibold">
                    {order.status === "Order Placed" ? (
                      <div className="text-yellow-500">{order.status}</div>
                    ) : order.status === "Canceled" ? (
                      <div className="text-red-500">{order.status}</div>
                    ) : (
                      <div className="text-green-500">{order.status}</div>
                    )}
                  </h1>
                </div>
                <div className="w-none md:w-[5%] hidden md:block">
                  <h1 className="text-sm text-ascent-2">
                    {order.mode || "Online"}
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
