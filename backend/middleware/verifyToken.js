import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // First, try to get the token from the Authorization header
  let token = req.headers.authorization?.split(" ")[1];

  // If no token in the header, check for the token in cookies (for Google login)
  if (!token) {
    token = req.cookies.token;
  }

  // If no token is found, return unauthorized error
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    // Decode the token using JWT and secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to the request object
    req.userId = decoded.userId; // Ensure this key matches what you are setting in the token
    req.isAdmin = decoded.isAdmin; // Ensure isAdmin is set in your token if you have it

    next(); // Move to the next middleware
  } catch (error) {
    console.log("Error in verifyToken:", error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - invalid token" });
  }
};
