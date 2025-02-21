import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
  songIndex: { type: Number, required: true }
});

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  songs: [songSchema], // Array of song objects with songId and songIndex
  createdAt: { type: Date, default: Date.now }
});

export const Playlist = mongoose.model('Playlist', playlistSchema);


