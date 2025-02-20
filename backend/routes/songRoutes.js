import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import isAdmin  from "../middleware/isAdmin.js";
import {upload} from "../middleware/multer.js"; // Import fixed multer middleware

import {
  addSong,
  createAlbum,
  deleteSong,
  getAllAlbums,
  getAllSongs,
  getAllSongsByAlbum,
  getSingleSong,
  updateSong, // Add updateSong controller
} from "../controllers/songController.js";

const router = express.Router();

// Album Routes
router.post(
  "/album/new",
  verifyToken,
  isAdmin,
  upload.single("thumbnail"),
  createAlbum
);
router.get("/album/all", verifyToken, getAllAlbums);

// Song Routes
router.post(
  "/new",
  verifyToken,
  isAdmin,
  upload.fields([{ name: "audio" }, { name: "thumbnail" }]),
  addSong
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.fields([{ name: "audio" }, { name: "thumbnail" }]),
  updateSong
); // Update song with new thumbnail/audio
router.get("/single/:id", verifyToken, getSingleSong);
router.delete("/:id", verifyToken, isAdmin, deleteSong);
router.get("/all", verifyToken, getAllSongs);
router.get("/album/:id", verifyToken, getAllSongsByAlbum);


export default router;
