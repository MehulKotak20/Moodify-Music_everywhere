import { song as Song } from "../models/song.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import cloudinary from "cloudinary";

// 📌 Add new song
export const addSong = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    const { title, singer, album, genre, mood, weather, language } = req.body;

    if (!req.files || !req.files.audio) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    console.log("Uploading audio...");
    const audioUrl = await uploadToCloudinary(
      req.files.audio[0],
      "music"
    ).catch((err) => {
      console.error("Audio Upload Failed:", err);
      throw new Error("Failed to upload audio file");
    });

    let thumbnailUrl = null;
    if (req.files.thumbnail) {
      console.log("Uploading thumbnail...");
      thumbnailUrl = await uploadToCloudinary(
        req.files.thumbnail[0],
        "thumbnails"
      ).catch((err) => {
        console.error("Thumbnail Upload Failed:", err);
        throw new Error("Failed to upload thumbnail");
      });
    }

    console.log("Creating new song document...");
    const newSong = new Song({
      title,
      singer,
      album,
      genre,
      mood,
      weather,
      language,
      audio: audioUrl,
      thumbnail: thumbnailUrl,
    });

    await newSong.save();
    console.log("Song saved successfully!");

    res.status(201).json({ message: "Song added successfully", song: newSong });
  } catch (error) {
    console.error("Error in addSong:", error);
    res.status(500).json({ message: error.message });
  }
};




export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      singer,
      album,
      genre,
      mood,
      weather,
      language,
      existingAudio,
      existingThumbnail,
    } = req.body;

    let updatedData = {};

    // Update only the fields that are passed in the request
    if (title) updatedData.title = title;
    if (singer) updatedData.singer = singer;
    if (album) updatedData.album = album;
    if (genre) updatedData.genre = genre;
    if (mood) updatedData.mood = mood;
    if (weather) updatedData.weather = weather;
    if (language) updatedData.language = language;

    // If a new audio file is provided, upload to Cloudinary
    if (req.files && req.files.audio) {
      updatedData.audio = await uploadToCloudinary(req.files.audio[0], "music");
    } else {
      // If no new audio file is provided, keep the existing audio URL
      updatedData.audio = existingAudio || updatedData.audio;
    }

    // If a new thumbnail is provided, upload to Cloudinary
    if (req.files && req.files.thumbnail) {
      updatedData.thumbnail = await uploadToCloudinary(
        req.files.thumbnail[0],
        "thumbnails"
      );
    } else {
      // If no new thumbnail is provided, keep the existing thumbnail URL
      updatedData.thumbnail = existingThumbnail || updatedData.thumbnail;
    }

    const updatedSong = await Song.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json({
      message: "Song updated successfully",
      song: updatedSong,
    });
  } catch (error) {
    console.error("Error updating song:", error);
    res.status(500).json({ message: error.message });
  }
};



export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) return res.status(404).json({ message: "Song not found" });

    // Extract public_id from Cloudinary URL
    const getPublicId = (url) => {
      const parts = url.split("/");
      return parts[parts.length - 1].split(".")[0]; // Extract public_id without extension
    };

    if (song.audio) {
      const audioPublicId = getPublicId(song.audio);
      await cloudinary.v2.uploader.destroy(audioPublicId, { resource_type: "video" });
    }

    if (song.thumbnail) {
      const imagePublicId = getPublicId(song.thumbnail);
      await cloudinary.v2.uploader.destroy(imagePublicId, { resource_type: "image" });
    }

    await song.deleteOne();
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ message: error.message });
  }
};


// 📌 Get all songs
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get a single song by ID
export const getSingleSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get all albums (distinct album names)
export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Song.distinct("album");
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get all songs in an album
export const getAllSongsByAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await Song.find({ album: id });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Create a new album (simply add a song with a new album name)
export const createAlbum = async (req, res) => {
  try {
    const { album } = req.body;
    if (!album)
      return res.status(400).json({ message: "Album name is required" });

    res.status(201).json({ message: "Album created successfully", album });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
