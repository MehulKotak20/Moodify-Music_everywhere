import { Playlist } from "../models/playlistModel.js"; // Import Playlist schema

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
    res.status(201).json({
      message: "Playlist created successfully",
      playlist: newPlaylist,
    });
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
      return res
        .status(403)
        .json({ message: "Unauthorized or playlist not found" });
    }

    if (name) playlist.name = name;
    if (songs) playlist.songs = songs;

    await playlist.save();
    res.json({ message: "Playlist updated successfully", playlist });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating playlist", error: error.message });
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist || playlist.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized or playlist not found" });
    }

    await playlist.deleteOne();
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting playlist", error: error.message });
  }
};

// Get all playlists for a user (with song thumbnails, titles, etc.)
export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.userId; // User ID from authenticated token

    const playlists = await Playlist.find({ userId }).populate({
      path: "songs.songId",
      select: "title thumbnail artist", // Include fields you actually need
    });

    if (!playlists.length) {
      console.log("No playlists found for user");
      return res.status(200).json([]); // Send empty array if nothing exists
    }

    res.status(200).json(playlists); // Send populated playlists
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlists", error: error.message });
  }
};

export const getSinglePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate({
      path: "songs.songId", // Populate the songId field
      select: "title thumbnail singer audio duration", // Use 'singer' instead of 'artist'
    });

    if (!playlist || playlist.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized or playlist not found" });
    }

    // Debugging: Log the playlist response
    console.log("Fetched Playlist:", JSON.stringify(playlist, null, 2));

    const formattedPlaylist = {
      _id: playlist._id,
      name: playlist.name,
      thumbnail: playlist.thumbnail || "default-playlist.png",
      songs: playlist.songs
        .filter((s) => s.songId) // Ensure the song exists
        .map((s) => ({
          _id: s.songId._id,
          title: s.songId.title,
          thumbnail: s.songId.thumbnail || "default-thumbnail.png",
          singer: s.songId.singer || "Unknown Singer",
          audio: s.songId.audio,
        })),
    };

    res.json(formattedPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlist", error: error.message });
  }
};


