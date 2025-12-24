const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Error } = require("../utilis/responseWrapper");

const JWT_SECRET = "koi bhi String De skte hai";

module.exports = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized: No token provided or wrong format");
  }
  const token = req.headers.authorization.split(" ")[1];

  console.log("Tokennn", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req._id = decoded._id;

    next();
  } catch (error) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};


