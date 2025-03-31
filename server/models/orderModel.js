import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    books: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    status: {
      type: String,
      enum: ["Order Placed", "Delivered", "Canceled", "Payment Pending"],
      default: "Order Placed",
    },
    mode: {
      type: String,
      default: "Online",
    },
    address: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
