import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  moods: [
    {
        type: String,
    }
  ],
  
  weather: String,
  genre: String,
  url: String, // Cloudinary or any storage link
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Song", songSchema);
