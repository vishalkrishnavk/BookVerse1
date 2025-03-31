import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication failed: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed: Token missing" });
    }

    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token" });
  }
};

export default userAuth;
