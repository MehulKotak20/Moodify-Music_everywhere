import React, { useState, useEffect } from "react";
import axios from "axios";

const SongForm = ({ fetchSongs, initialData, onSubmit }) => {
  // Initialize state based on whether we are editing or adding
  const [song, setSong] = useState({
    title: "",
    singer: "",
    album: "",
    language: "",
    genre: "",
    mood: "",
    weather: "",
    thumbnail: null,
    audio: null,
  });

  // Handle the case where we're editing an existing song
  useEffect(() => {
    if (initialData) {
      setSong({
        title: initialData.title || "",
        singer: initialData.singer || "",
        album: initialData.album || "",
        language: initialData.language || "",
        genre: initialData.genre || "",
        mood: initialData.mood || "",
        weather: initialData.weather || "",
        thumbnail: null, // Prevent overriding thumbnail if not provided
        audio: null, // Prevent overriding audio if not provided
      });
    }
  }, [initialData]);

  const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];
  const languages = ["English", "Hindi", "Gujarati", "Punjabi"];
  const moods = ["Happy", "Sad", "Energetic", "Romantic"];
  const weatherOptions = ["Sunny", "Rainy", "Cloudy", "Snowy"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSong({ ...song, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setSong({ ...song, [name]: files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!song.title || !song.audio) {
      alert("Please provide song title and audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", song.title);
    formData.append("singer", song.singer);
    formData.append("album", song.album);
    formData.append("language", song.language);
    formData.append("genre", song.genre);
    formData.append("mood", song.mood);
    formData.append("weather", song.weather);
    formData.append("thumbnail", song.thumbnail);
    formData.append("audio", song.audio);

    try {
      // If editing an existing song, call the update endpoint
      if (initialData) {
        await axios.put(
          `http://localhost:5000/api/song/${initialData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Song updated successfully!");
      } else {
        // If adding a new song, call the add endpoint
        await axios.post("http://localhost:5000/api/song/new", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Song added successfully!");
      }

      // Reset the form and refetch songs
      setSong({
        title: "",
        singer: "",
        album: "",
        language: "",
        genre: "",
        mood: "",
        weather: "",
        thumbnail: null,
        audio: null,
      });

      fetchSongs();
    } catch (error) {
      console.error("Error submitting song:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold">
        {initialData ? "Edit Song" : "Add Song"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <input
          type="text"
          name="title"
          value={song.title}
          onChange={handleInputChange}
          placeholder="Song Title"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="singer"
          value={song.singer}
          onChange={handleInputChange}
          placeholder="Singer"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="album"
          value={song.album}
          onChange={handleInputChange}
          placeholder="Album"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="language"
          value={song.language}
          onChange={handleInputChange}
          placeholder="Language"
          className="border p-2 rounded"
          list="languageList"
        />
        <datalist id="languageList">
          {languages.map((lang, index) => (
            <option key={index} value={lang} />
          ))}
        </datalist>
        <input
          type="text"
          name="genre"
          value={song.genre}
          onChange={handleInputChange}
          placeholder="Genre"
          className="border p-2 rounded"
          list="genreList"
        />
        <datalist id="genreList">
          {genres.map((genre, index) => (
            <option key={index} value={genre} />
          ))}
        </datalist>
        <input
          type="text"
          name="mood"
          value={song.mood}
          onChange={handleInputChange}
          placeholder="Mood"
          className="border p-2 rounded"
          list="moodList"
        />
        <datalist id="moodList">
          {moods.map((mood, index) => (
            <option key={index} value={mood} />
          ))}
        </datalist>
        <input
          type="text"
          name="weather"
          value={song.weather}
          onChange={handleInputChange}
          placeholder="Weather"
          className="border p-2 rounded"
          list="weatherList"
        />
        <datalist id="weatherList">
          {weatherOptions.map((weather, index) => (
            <option key={index} value={weather} />
          ))}
        </datalist>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <input
          type="file"
          name="audio"
          accept="audio/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
          required
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        {initialData ? "✅ Update Song" : "➕ Add Song"}
      </button>
    </div>
  );
};

export default SongForm;
