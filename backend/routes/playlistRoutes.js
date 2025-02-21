import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getUserPlaylists,
  getSinglePlaylist,
} from "../controllers/playlistController.js";

const router = express.Router();

// Create a new playlist
router.post("/new", verifyToken, createPlaylist);

// Update an existing playlist (e.g., rename, add/remove songs)
router.put("/:id", verifyToken, updatePlaylist);

// Delete a playlist
router.delete("/:id", verifyToken, deletePlaylist);

// Get all playlists for a user
router.get("/all", verifyToken, getUserPlaylists);

// Get a single playlist by ID
router.get("/:id", verifyToken, getSinglePlaylist);

export default router;
