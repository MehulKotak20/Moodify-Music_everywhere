import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Reusable Modal component
import axios from "axios";

const CreatePlaylistModal = ({ onClose }) => {
  const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);

  // Fetch all songs from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/song/all")
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
  
      // Recalculate indices
      newSelection = newSelection.map((song, i) => ({ ...song, songIndex: i + 1 }));
  
      return newSelection;
    });
  };
  

  // Submit playlist to backend
  const createPlaylist = () => {
    axios
      .post("http://localhost:5000/api/playlist/new", { name: playlistName, songs: selectedSongs })
      .then(() => {
        onClose();
        setPlaylistName("");
        setSelectedSongs([]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Modal onClose={onClose} title="Create Playlist">
      <input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded bg-black text-white"
      />
      <div className="max-h-[300px] overflow-y-auto">
        {songs.map((song, index) => (
          <div key={song._id} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              onChange={() => handleSongSelection(song._id)}
              checked={selectedSongs.some((s) => s.songId === song._id)}
            />
            <p>
              {selectedSongs.findIndex((s) => s.songId === song._id) + 1 || "-"}.
              {song.title}
            </p>
          </div>
        ))}
      </div>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded mt-4"
        onClick={createPlaylist}
      >
        Create Playlist
      </button>
    </Modal>
  );
};

export default CreatePlaylistModal;
