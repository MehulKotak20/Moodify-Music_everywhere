import React, { useState, useEffect } from "react";
import Sidebar_ from "./Sidebar_";
import Navbar from "./Navbar";
import Player from "./Player";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import Cookies from "js-cookie";

const Layout = () => {
  const [songs, setSongs] = useState([]); // All songs
  const [filteredSongs, setFilteredSongs] = useState([]); // Filtered songs
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [playedSongs, setPlayedSongs] = useState(new Set());

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        let token = localStorage.getItem("token") || Cookies.get("token");

        const response = await axios.get("http://localhost:5000/api/song/all", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        setSongs(response.data);
        setFilteredSongs(response.data); // Initially, show all songs
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  // 🎵 Play a song & update queue
  const playSong = (song) => {
    setCurrentSong(song);
    setPlayedSongs((prev) => new Set([...prev, song._id]));
    setQueue(getSimilarSongs(song));
  };

  const playNext = () => {
    const remainingSongs = queue.filter((s) => !playedSongs.has(s._id));

    if (remainingSongs.length > 0) {
      const nextSong = remainingSongs.shift();
      setCurrentSong(nextSong);
      setPlayedSongs((prev) => new Set([...prev, nextSong._id]));
      setQueue(getSimilarSongs(nextSong));
    } else {
      console.log("All songs played. Stopping playback.");
      setQueue([]);
    }
  };

  // 🛠 Filter songs by name, artist, mood, and weather
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredSongs(songs); // Reset if empty
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const results = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowercasedQuery) ||
        song.singer.toLowerCase().includes(lowercasedQuery) ||
        (song.mood && song.mood.toLowerCase().includes(lowercasedQuery)) ||
        (song.weather && song.weather.toLowerCase().includes(lowercasedQuery))
    );

    setFilteredSongs(results);
  };

  return (
    <div className="h-screen bg-[#121212] text-white">
      <div className="h-[90%] flex">
        <Sidebar_ songs={songs} playSong={playSong} />
        <div className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] overflow-auto lg:w-[75%] lg:ml-0">
          {/* Pass search handler to Navbar */}
          <Navbar onSearch={handleSearch} />

          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">All Songs</h2>

            {filteredSongs.length === 0 ? (
              <p className="text-gray-400">No songs found.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {filteredSongs.map((song) => (
                  <div
                    key={song._id}
                    className="bg-[#181818] p-4 rounded-lg cursor-pointer hover:bg-[#1f1f1f] transition relative"
                    onClick={() => playSong(song)}
                  >
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold truncate">
                        {song.title}
                      </h3>
                      <p className="text-xs text-gray-400">{song.singer}</p>
                      <p className="text-xs text-gray-500">{song.genre}</p>
                      <p className="text-xs text-gray-500">
                        {song.mood ? `Mood: ${song.mood}` : ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {song.weather ? `Weather: ${song.weather}` : ""}
                      </p>
                    </div>
                    <button className="absolute bottom-3 right-3 bg-green-500 p-2 rounded-full">
                      <FaPlay size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {currentSong && (
        <Player
          song={currentSong}
          setSong={setCurrentSong}
          playNext={playNext}
        />
      )}
    </div>
  );
};

export default Layout;
