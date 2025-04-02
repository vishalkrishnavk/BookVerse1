import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axiosConfig.js";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          toast.error("Invalid payment session");
          navigate("/cart");
          return;
        }

        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const response = await axiosInstance.get(
          `/order/verify-payment?session_id=${sessionId}`,
          { headers }
        );

        if (response.data.success) {
          toast.success("Payment successful! Your order has been placed.");
          navigate("/order-history");
        } else {
          toast.error("Payment verification failed");
          navigate("/cart");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Failed to verify payment");
        navigate("/cart");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-bgColor flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="text-ascent-1 mt-4">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;
