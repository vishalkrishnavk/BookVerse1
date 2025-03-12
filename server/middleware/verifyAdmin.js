import User from "../models/userModel.js";

export const verifyAdmin = async (req, res, next) => {
  const { id } = req.headers;
  const user = await User.findById(id);
  if (user.role !== "admin")
    return res.status(401).json({ message: "Unauthorised access" });
  next();
};
