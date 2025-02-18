

export const isAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};
