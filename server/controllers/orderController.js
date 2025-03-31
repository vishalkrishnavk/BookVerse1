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

    // Create line items for Stripe
    const lineItems = order.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          description: item.desc.substring(0, 100), // Add description
          images: [item.url], // Add book image
        },
        unit_amount: Math.round(item.price * 100), // Ensure proper conversion to cents
      },
      quantity: 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONT_URL}payment-success`,
      cancel_url: `${process.env.FRONT_URL}payment-cancel`,
      metadata: {
        userId,
        address,
        orderIds: JSON.stringify(order.map((item) => item._id)),
      },
    });

    // Create orders in pending state
    const orderPromises = order.map(async (orderData) => {
      const newOrder = new Order({
        user: userId,
        books: orderData._id,
        status: "Order Placed",
        address,
        paymentId: session.id,
        mode: "Online",
      });
      return newOrder.save();
    });

    await Promise.all(orderPromises);

    // Clear the user's cart after successful order creation
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    return res.status(200).json({
      id: session.id,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const orderHistory = async (req, res) => {
  try {
    const { userId } = req.body.user;

    // Find all orders for the user and populate the books details
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
