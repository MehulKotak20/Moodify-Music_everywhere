import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const MashupCreator = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [timeline, setTimeline] = useState({});
  const [audioQueue, setAudioQueue] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem("token") || Cookies.get("token");

    axios
      .get("http://localhost:5000/api/song/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      })
      .then((res) => setSongs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleSongSelection = (songId) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const handleTimelineChange = (songId, field, value) => {
    setTimeline((prev) => ({
      ...prev,
      [songId]: { ...prev[songId], [field]: value },
    }));
  };

  const handlePreview = () => {
    const queue = selectedSongs.map((id) => {
      const song = songs.find((s) => s.id === id);
      return { ...song, ...timeline[id] };
    });
    setAudioQueue(queue);
  };

  useEffect(() => {
    if (audioQueue.length === 0) return;

    const audioElements = audioQueue.map((track) => {
      const audio = new Audio(track.url);
      audio.currentTime = track.start || 0;

      setTimeout(() => audio.play(), (track.start || 0) * 1000);
      setTimeout(() => audio.pause(), (track.end || 0) * 1000);

      return audio;
    });

    return () => audioElements.forEach((audio) => audio.pause());
  }, [audioQueue]);

  return (
    <div className="bg-gradient-to-br from-blue-700 to-purple-800 p-6 rounded-2xl shadow-xl text-white max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">🎵 Create Your Mashup</h2>

      <div className="song-selection mb-4 space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center gap-3 bg-white text-black p-2 rounded-lg cursor-pointer hover:bg-blue-200"
            onClick={() => toggleSongSelection(song.id)}
          >
            <input
              type="checkbox"
              checked={selectedSongs.includes(song.id)}
              onChange={() => toggleSongSelection(song.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <label>{song.name}</label>
          </div>
        ))}
      </div>

      {selectedSongs.map((songId) => (
        <div
          key={songId}
          className="timeline-setup mb-3 p-3 bg-white text-black rounded-lg"
        >
          <h3 className="font-semibold">
            {songs.find((s) => s.id === songId).name}
          </h3>
          <div className="flex gap-4">
            <div>
              <label>Start Time (seconds)</label>
              <input
                type="number"
                min="0"
                onChange={(e) =>
                  handleTimelineChange(songId, "start", Number(e.target.value))
                }
                className="border rounded px-2 py-1 w-20"
              />
            </div>
            <div>
              <label>End Time (seconds)</label>
              <input
                type="number"
                min="0"
                onChange={(e) =>
                  handleTimelineChange(songId, "end", Number(e.target.value))
                }
                className="border rounded px-2 py-1 w-20"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full mt-4"
        onClick={handlePreview}
      >
        🎧 Preview Mashup
      </button>
    </div>
  );
};

export default MashupCreator;
