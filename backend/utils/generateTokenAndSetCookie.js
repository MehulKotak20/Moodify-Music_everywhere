import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, isAdmin) => {
  const token = jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};
