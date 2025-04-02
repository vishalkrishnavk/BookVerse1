import React from "react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bgColor flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <RxCross2 className="text-red-600 text-4xl" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-ascent-1 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-ascent-2 mb-6">
          Your payment was cancelled. If you experienced any issues, please try
          again or contact support.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-primary text-ascent-1 py-2 rounded hover:bg-primary/80 transition-colors"
          >
            Return to Cart
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

export default PaymentCancel;
