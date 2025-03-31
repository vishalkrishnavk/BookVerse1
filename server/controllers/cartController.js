import User from "../models/userModel.js";

export const addCart = async (req, res) => {
  const { userId } = req.body.user;
  const { id } = req.params;
  try {
    const user = await User.findById(userId);
    if (user.cart.includes(id))
      return res.status(409).json({ message: "Book already exists in cart" });
    await User.findByIdAndUpdate(userId, { $push: { cart: id } });
    return res.status(200).json({ message: "Book added to cart succesfully" });
  } catch (error) {
    console.log("error in adding to cart", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeCart = async (req, res) => {
  const { userId } = req.body.user;
  console.log(userId);
  const { id } = req.params;
  try {
    const user = await User.findById(userId);
    if (user.cart.includes(id)) {
      await User.findByIdAndUpdate(userId, { $pull: { cart: id } });
      return res.status(200).json({ message: "Book removed from cart" });
    } else {
      return res.status(400).json({ message: "Book is not in cart" });
    }
  } catch (error) {
    console.log("Error in remving book from cart", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const viewCart = async (req, res) => {
  const { id } = req.headers;
  try {
    const user = await User.findById(id).populate("cart");
    const cart = user.cart.slice().reverse();
    return res.status(200).json({ cart, address: user.address });
  } catch (error) {
    console.log("Error in viewing cart", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAddress = async (req, res) => {
  const { userId } = req.body.user;
  const { address } = req.body;

  try {
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { address },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Address updated successfully",
      address: user.address,
    });
  } catch (error) {
    console.log("Error in updating address", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
