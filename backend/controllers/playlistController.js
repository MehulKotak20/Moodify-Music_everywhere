import {Playlist} from "../models/playlistModel.js"; // Import Playlist schema

export const createPlaylist = async (req, res) => {
  try {
    const { name, songs } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID" });
    }

    const newPlaylist = new Playlist({
      userId: req.userId, // Use req.userId instead of req.user.id
      name,
      songs,
    });

    await newPlaylist.save();
    res
      .status(201)
      .json({
        message: "Playlist created successfully",
        playlist: newPlaylist,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating playlist", error: error.message });
  }
};


// Update an existing playlist
export const updatePlaylist = async (req, res) => {
  try {
    const { name, songs } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist || playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or playlist not found" });
    }

    if (name) playlist.name = name;
    if (songs) playlist.songs = songs;

    await playlist.save();
    res.json({ message: "Playlist updated successfully", playlist });
  } catch (error) {
    res.status(500).json({ message: "Error updating playlist", error: error.message });
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist || playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or playlist not found" });
    }

    await playlist.deleteOne();
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting playlist", error: error.message });
  }
};

// Get all playlists for a user
export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.userId; // Get user ID from the authenticated token
    const playlists = await Playlist.find({ userId }); // Assuming you store user ID in the playlists

    if (playlists.length === 0) {
      console.log("No playlists found for user");
      return res.status(200).json([]); // Return empty array if no playlists
    }

    res.status(200).json(playlists); // Return playlists for the user
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single playlist
export const getSinglePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist || playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or playlist not found" });
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlist", error: error.message });
  }
};
