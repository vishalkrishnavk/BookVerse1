import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const placeOrder = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { order, address } = req.body;

    if (!order || order.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!address) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const lineItems = order.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          description: item.desc.substring(0, 100),
          images: [item.url],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONT_URL}payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_URL}payment-cancel`,
      metadata: {
        userId: userId,
      },
    });

    // Create pending orders
    await Order.create(
      order.map((orderData) => ({
        user: userId,
        books: orderData._id,
        status: "Payment Pending",
        address,
        paymentId: session.id,
        mode: "Online",
      }))
    );

    return res.status(200).json({
      id: session.id,
      message: "Checkout session created",
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    const { userId } = req.body.user;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      await Order.updateMany(
        { paymentId: session_id },
        { $set: { status: "Order Placed" } }
      );

      await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

      return res.status(200).json({
        success: true,
        message: "Payment successful and orders confirmed",
      });
    } else {
      await Order.deleteMany({ paymentId: session_id });
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const orderHistory = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const orders = await Order.find({ user: userId })
      .populate("books")
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ ordersData: orders });
  } catch (error) {
    console.log("Error in getting order history", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({ path: "books" })
      .populate({ path: "user" })
      .sort({ createdAt: -1 });
    return res.status(200).json({ userData });
  } catch (error) {
    console.log("Error in geting all orders", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.log("Error in updating order", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
