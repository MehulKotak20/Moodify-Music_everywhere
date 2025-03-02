import {Playlist} from "../models/playlistModel.js"; // Import Playlist schema

export const createPlaylist = async (req, res) => {
  try {
    const { name, songs } = req.body
    const newPlaylist = new Playlist({
      userId: req.user.id,
      name,
      songs,
    });

    await newPlaylist.save();
    res.status(201).json({ message: "Playlist created successfully", playlist: newPlaylist });
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist", error: error.message });
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
    const playlists = await Playlist.find({ userId: req.user.id });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlists", error: error.message });
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
