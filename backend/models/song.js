import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    singer: {
      type: String,
    },
    thumbnail: {
      type: String, // Store only the URL as a string
    },
    audio: {
      type: String, // Store only the URL as a string
      required: true,
    },
    album: {
      type: String,
    },
    language: {
      type: String,
    },
    genre: {
      type: String,
    },
    mood: {
      type: String,
    },
    weather: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const song = mongoose.model("Song", schema);
