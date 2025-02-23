import React, { useState, useEffect } from "react";
import Sidebar_ from "./Sidebar_";
import Navbar from "./Navbar";
import Player from "./Player";
import axios from "axios";
import { FaPlay } from "react-icons/fa";

const Layout = () => {
  const [songs, setSongs] = useState([]); // All songs from backend
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [playedSongs, setPlayedSongs] = useState(new Set()); // Store played songs

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/song/all",{
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        }
        );
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  // Function to find similar songs but exclude already played ones
  const getSimilarSongs = (song) => {
    if (!song || !songs.length) return [];

    const filteredSongs = songs.filter(
      (s) => s._id !== song._id && !playedSongs.has(s._id) // Exclude current and played songs
    );

    return filteredSongs.sort((a, b) => {
      let scoreA = 0,
        scoreB = 0;

      if (a.singer === song.singer) scoreA += 3;
      if (a.language === song.language) scoreA += 2;
      if (a.genre === song.genre) scoreA += 1;

      if (b.singer === song.singer) scoreB += 3;
      if (b.language === song.language) scoreB += 2;
      if (b.genre === song.genre) scoreB += 1;

      return scoreB - scoreA;
    });
  };

  // Play a song and update the queue
  const playSong = (song) => {
    setCurrentSong(song);
    setPlayedSongs((prev) => new Set([...prev, song._id])); // Add song to played list
    setQueue(getSimilarSongs(song));
  };

  // Play the next song in the queue while avoiding repeats
  const playNext = () => {
    const remainingSongs = queue.filter((s) => !playedSongs.has(s._id));

    if (remainingSongs.length > 0) {
      const nextSong = remainingSongs.shift();
      setCurrentSong(nextSong);
      setPlayedSongs((prev) => new Set([...prev, nextSong._id]));
      setQueue(getSimilarSongs(nextSong));
    } else {
      console.log("All songs played. Stopping playback.");
      setQueue([]); // Clear queue
    }
  };

  return (
    <div className="h-screen bg-[#121212] text-white">
      <div className="h-[90%] flex">
        <Sidebar_ songs={songs} playSong={playSong} />
        <div className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] overflow-auto lg:w-[75%] lg:ml-0">
          <Navbar />

          {/* Songs List */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">All Songs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {songs.map((song) => (
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
                  </div>
                  <button className="absolute bottom-3 right-3 bg-green-500 p-2 rounded-full">
                    <FaPlay size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player - Only show if a song is playing */}
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
