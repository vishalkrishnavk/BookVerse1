import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
export const placeOrder = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { order } = req.body;
    for (const orderData of order) {
      const newOrder = new Order({ user: userId, books: orderData._id });
      const orderDataFromDb = await newOrder.save();
      await User.findByIdAndUpdate(userId, {
        $push: { orders: orderDataFromDb._id },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { cart: orderData._id },
      });
    }
    return res.status(200).json({ message: "Succesfully Placed Order" });
  } catch (error) {
    console.log("error in placeOrder", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const orderHistory = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const userData = await User.findById(userId).populate({
      path: "orders",
      populate: { path: "books" },
    });
    if (!userData) return res.status(404).json({ message: "User not found" });
    const ordersData = userData.orders.slice().reverse();
    return res.status(200).json({ ordersData });
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
