import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";
import Cookies from "js-cookie";

const CreatePlaylistModal = ({ onClose }) => {
  const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/song/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setSongs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSongSelection = (songId) => {
    setSelectedSongs((prev) => {
      let newSelection = [...prev];
      const exists = prev.findIndex((song) => song.songId === songId);

      if (exists !== -1) {
        newSelection.splice(exists, 1);
      } else {
        newSelection.push({ songId, songIndex: newSelection.length + 1 });
      }

      return newSelection.map((song, i) => ({ ...song, songIndex: i + 1 }));
    });
  };

  const createPlaylist = async () => {
    if (!playlistName.trim() || selectedSongs.length === 0) return;

    try {
      let token = localStorage.getItem("token") || Cookies.get("token");

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/playlist/new",
        { name: playlistName, songs: selectedSongs },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("Playlist created:", response.data);
      onClose();
      setPlaylistName("");
      setSelectedSongs([]);
    } catch (error) {
      console.error("Error creating playlist:", error.response?.data || error);
    }
  };

  return (
    <Modal onClose={onClose} title="Create Playlist">
      <input
        type="text"
        placeholder="Playlist Name *"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded bg-black text-white"
      />
      <style>
        {`
          .scrollbar-hidden::-webkit-scrollbar {
            display: none;
          }

          .scrollbar-hidden {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* 🎵 Song List Grid View */}
      <div className="max-h-[300px] overflow-auto scrollbar-hidden none grid grid-cols-2 md:grid-cols-3 gap-4">
        {songs.map((song) => {
          const isChecked = selectedSongs.some((s) => s.songId === song._id);
          const songIndex =
            selectedSongs.findIndex((s) => s.songId === song._id) + 1;

          return (
            <div
              key={song._id}
              onClick={() => handleSongSelection(song._id)}
              className={`relative flex flex-col items-center justify-center p-3 border rounded-lg transition-all cursor-pointer ${
                isChecked
                  ? "border-green-500 bg-green-900/30"
                  : "border-gray-600"
              } hover:border-white hover:bg-gray-800/50`}
            >
              {/* Index Badge */}
              {isChecked && (
                <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                  {songIndex}
                </span>
              )}

              {/* Song Image */}
              <img
                src={song.thumbnail || "default-song-image.jpg"}
                alt={song.title}
                className="w-16 h-16 rounded-md"
              />

              {/* Song Title */}
              <p className="mt-2 text-center text-sm">{song.title}</p>
            </div>
          );
        })}
      </div>

      {/* Create Button */}
      <button
        className={`px-4 py-2 mt-4 w-full rounded ${
          playlistName.trim() && selectedSongs.length
            ? "bg-green-500 text-white"
            : "bg-gray-400 text-gray-800 cursor-not-allowed"
        }`}
        onClick={createPlaylist}
        disabled={!playlistName.trim() || selectedSongs.length === 0}
      >
        Create Playlist
      </button>
    </Modal>
  );
};

export default CreatePlaylistModal;
