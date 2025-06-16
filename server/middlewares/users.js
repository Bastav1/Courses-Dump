const jwt = require("jsonwebtoken");
const { JWT_USER } = require("../config");

const userMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_USER);
    req.userId = decoded.id;
    req.userName = decoded.userName;
    next();
  } catch (e) {
    console.error("JWT Error:", e);
    return res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports = { userMiddleware };
