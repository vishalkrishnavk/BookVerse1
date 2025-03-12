import User from "../models/userModel.js";

export const verifyAdmin = async (req, res, next) => {
  const { userId } = req.body.user;
  const user = await User.findById(userId);
  if (user.role !== "admin")
    return res.status(401).json({ message: "Unauthorised access" });
  next();
};
