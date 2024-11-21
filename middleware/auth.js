
// *********************************AUTH MIDDLEWARE CODE**********************


const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from the 'Authorization' header
  const authHeader = req.header("Authorization");


  // authHeader for postman and authHeader starts with Bearer for swagger 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or format is incorrect" });
  }

  // this will Extract the token part after "Bearer"
  const token = authHeader.split(" ")[1];

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user; // Assign the decoded user to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};


