import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axiosConfig.js";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "./../../components/Loading.jsx";
import toast from "react-hot-toast";
import AddressOverlay from "../../components/BookStore/AddressOverlay";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const history = useNavigate();
  const [Cart, setCart] = useState();
  const [Total, setTotal] = useState(0);
  const [showAddressOverlay, setShowAddressOverlay] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
    if (isLoggedIn === false) {
      history("/");
    } else {
      const fetch = async () => {
        const res = await axiosInstance.get(`/cart/`, {
          headers,
        });
        setCart(res.data.cart);
        setUserAddress(res.data.address);
      };
      fetch();
    }
  }, [Cart]);
  useEffect(() => {
    if (Cart && Cart.length > 0) {
      let total = 0;
      Cart.map((items) => {
        total += Number(items.price);
      });
      setTotal(total);
      total = 0;
    }
  }, [Cart]);
  const deletItem = async (id) => {
    try {
      const response = await axiosInstance.put(
        `/cart/remove/${id}`,
        {},
        { headers }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  const Overlay = () => {
    setShowAddressOverlay(true);
  };
  const PlaceOrder = async (addressToUse) => {
    try {
      setIsProcessing(true);
      const stripe = await loadStripe(
        `${process.env.REACT_APP_STRIPE_PUB_KEY}`
      );

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const response = await axiosInstance.post(
        `/order/place-order`,
        {
          order: Cart,
          address: addressToUse || userAddress,
        },
        { headers }
      );

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressSubmit = async (newAddress) => {
    setUserAddress(newAddress);
    await PlaceOrder(newAddress);
  };

  return (
    <div className="min-h-screen bg-bgColor px-12 py-8">
      {!Cart && <Loading />}
      {Cart && Cart.length === 0 && (
        <div className="h-screen">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-ascent-1">
              Empty Cart
            </h1>
            <img
              src="/empty-cart.png"
              alt="empty cart"
              className="lg:h-[50vh]"
            />
          </div>
        </div>
      )}
      {Cart && Cart.length > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-ascent-1 mb-8">
            Your Cart
          </h1>
          {Cart.map((items, i) => (
            <div
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-secondary justify-between items-center"
              key={i}
            >
              <img
                src={items.url}
                alt="/"
                className="h-[20vh] md:h-[10vh] object-cover"
              />
              <div className="w-full md:w-auto">
                <h1 className="text-2xl text-ascent-1 font-semibold text-start mt-2 md:mt-0">
                  {items.title}
                </h1>
                <p className="text-normal text-ascent-1 mt-2 hidden lg:block">
                  {items.desc.slice(0, 100)}...
                </p>
                <p className="text-normal text-ascent-1 mt-2 hidden md:block lg:hidden">
                  {items.desc.slice(0, 65)}...
                </p>
                <p className="text-normal text-ascent-1 mt-2 block md:hidden">
                  {items.desc.slice(0, 100)}...
                </p>
              </div>
              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-ascent-1 text-3xl font-semibold flex">
                  ₹ {items.price}
                </h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2 ms-12"
                  onClick={() => deletItem(items._id)}
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {Cart && Cart.length > 0 && (
        <div className="mt-4 w-full flex items-center justify-end">
          <div className="p-4 bg-secondary rounded">
            <h1 className="text-3xl text-ascent-1 font-semibold">
              Total Amount
            </h1>
            <div className="mt-3 flex items-center justify-between text-xl text-ascent-1">
              <h2>{Cart.length} books</h2> <h2>₹ {Total}</h2>
            </div>
            <div className="w-[100%] mt-3">
              <button
                className={`bg-primary rounded px-4 py-2 flex justify-center w-full font-semibold ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/80"
                } text-ascent-1`}
                onClick={Overlay}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place your order"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddressOverlay && (
        <AddressOverlay
          address={userAddress}
          onClose={() => setShowAddressOverlay(false)}
          onSubmit={handleAddressSubmit}
        />
      )}
    </div>
  );
};

export default Cart;
