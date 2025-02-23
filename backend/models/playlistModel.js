import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  songs: [
    {
      songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      songIndex: Number,
    },
  ],
});

export const Playlist = mongoose.model("Playlist", playlistSchema);
