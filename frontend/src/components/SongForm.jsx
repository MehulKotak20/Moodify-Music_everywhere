import React, { useState, useEffect } from "react";
import axios from "axios";

const SongForm = ({ fetchSongs, initialData, onSubmit }) => {
  const [song, setSong] = useState({
    title: "",
    singer: "",
    language: "",
    genre: "",
    mood: "",
    weather: "",
    thumbnail: null,
    audio: null,
  });

  useEffect(() => {
    if (initialData) {
      setSong({
        title: initialData.title || "",
        singer: initialData.singer || "",
        language: initialData.language || "",
        genre: initialData.genre || "",
        mood: initialData.mood || "",
        weather: initialData.weather || "",
        thumbnail: null,
        audio: null,
      });
    }
  }, [initialData]);

  const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];
  const languages = ["English", "Hindi", "Gujarati", "Punjabi"];
  const moods = ["Happy", "Sad", "Energetic", "Romantic"];
  const weatherOptions = ["Sunny", "Rainy", "Cloudy", "Snowy"];

  const artists = [
    { id: 1, name: 'Arijit Singh', image: '/Images/arijit.jpg' },
    { id: 2, name: 'Taylor Swift', image: '/Images/tylor.webp' },
    { id: 3, name: 'Diljit Dosanjh', image: '/Images/diljiit.jpg' },
    { id: 4, name: 'Darshan Raval', image: 'Images/darshan.jpg' },
    { id: 5, name: 'Neha Kakkar', image: 'Images/neha.webp' },
    { id: 6, name: 'Anuv Jain', image: 'Images/anuv.webp' },
    { id: 7, name: 'Pritam', image: 'Images/pritam.jpg' },
    { id: 8, name: 'Atif Aslam', image: 'Images/atif_new.jpg' },
    { id: 9, name: 'Sachin-jigar', image: 'Images/Sachin-jigar.jpg' },
    { id: 10, name: 'KK', image: 'Images/kk.jpg' },
    { id: 11, name: 'Shreya Ghosal', image: 'Images/shreya_ghosal.webp' },
    { id: 13, name: 'Yo Yo Honey Singh', image: 'Images/honey.jpg' },
    { id: 14, name: 'Selena Gomez', image: 'Images/selena.jpg' },
    { id: 15, name: 'Armaan Malik', image: 'Images/arman.jpg' },
    { id: 16, name: 'Harry Styles', image: 'Images/harry_styles.jpg' },
    { id: 17, name: 'Harshdeep Kaur', image: 'Images/harshdeep-kaur.jpg' },
  ].sort((a, b) => a.name.localeCompare(b.name));


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
    formData.append("language", song.language);
    formData.append("genre", song.genre);
    formData.append("mood", song.mood);
    formData.append("weather", song.weather);
    formData.append("thumbnail", song.thumbnail);
    formData.append("audio", song.audio);

    try {
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
        await axios.post("http://localhost:5000/api/song/new", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Song added successfully!");
      }

      setSong({
        title: "",
        singer: "",
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
        <select
          name="singer"
          value={song.singer}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Select Singer</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.name}>
              {artist.name}
            </option>
          ))}
        </select>

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
}
export default SongForm;