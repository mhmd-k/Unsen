import jwt from "jsonwebtoken";

const verifyJWTMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    if (!decoded?.userId) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

export default verifyJWTMiddleware;
