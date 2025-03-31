import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart from localStorage or Redux if needed
    const timer = setTimeout(() => {
      navigate("/profile/orderHistory");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bgColor flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        <h1 className="text-3xl font-bold text-ascent-1 mb-4">
          Payment Successful!
        </h1>
        <p className="text-ascent-2 mb-6">
          Thank you for your purchase. Your order has been successfully
          processed.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/profile/orderHistory")}
            className="w-full bg-primary text-ascent-1 py-2 rounded hover:bg-primary/80 transition-colors"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate("/all-books")}
            className="w-full bg-blue/10 text-blue py-2 rounded hover:bg-blue/20 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
