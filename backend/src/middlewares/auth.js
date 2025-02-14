const jwt = require("jsonwebtoken");
const { getUserById } = require("../models/userModel");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    getUserById(decoded.id, (err, res) => {
      if(err || !res.length) throw new Error(err);
      req.user = res[0];
      next();
    })
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
