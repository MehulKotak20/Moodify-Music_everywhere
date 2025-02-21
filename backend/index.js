import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import { verifyToken } from "./middleware/verifyToken.js"; // Import JWT verification middleware
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/songRoutes.js"
import playlistRoutes from "./routes/playlistRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Enable CORS for the frontend URL
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // Allows us to parse incoming JSON requests
app.use(cookieParser()); // Allows us to parse cookies (if needed for JWT)

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/song", songRoutes);
app.use("/api/playlist", playlistRoutes);


// Example of a protected route (that requires JWT)
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Serve static files and index.html in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port:", PORT);
});
