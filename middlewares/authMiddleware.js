const jwt = require("jsonwebtoken");

// Middleware to Authenticate Users
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.authData = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden - Invalid Token" });
  }
};

// Middleware to Authorize Users Based on Roles
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.authData) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No User Data Found" });
    }
    if (!allowedRoles.includes(req.authData.role)) {
      res.status(403).json({
        message: "Unauthorized : Forbidden: Insufficient Permissions",
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
