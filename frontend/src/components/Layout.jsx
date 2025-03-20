import React, { useState, useEffect } from "react";
import Sidebar_ from "./Sidebar_";
import Navbar from "./Navbar";
import Player from "./Player";
import axios from "axios";
import Cookies from "js-cookie";
import SongGrid from "./SongGrid";
import {PlaylistView} from "./PlaylistView";


const Layout = () => {
  const [allSongs, setAllSongs] = useState([]); // Store all songs separately
  const [filteredSongs, setFilteredSongs] = useState([]); // Songs currently displayed (all or playlist)
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [playedSongs, setPlayedSongs] = useState(new Set());
  const [playlistid, setPlaylistid] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    fetchAllSongs(); // Fetch all songs once on mount
  }, []);

  useEffect(() => {
    if (playlistid) {
      fetchSongsByPlaylistId();
    } else {
      setFilteredSongs(allSongs); // Reset to all songs if no playlist is selected
      setPlaylistData(null);
    }
  }, [playlistid, allSongs]);

  const fetchAllSongs = async () => {
    try {
      let token = localStorage.getItem("token") || Cookies.get("token");
      const response = await axios.get("http://localhost:5000/api/song/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      setAllSongs(response.data);
      setFilteredSongs(response.data); // Default to showing all songs
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const fetchSongsByPlaylistId = async () => {
    try {
      let token = localStorage.getItem("token") || Cookies.get("token");
      const response = await axios.get(`http://localhost:5000/api/playlist/${playlistid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
  
      console.log("Playlist Data Received:", response.data); // Debug log
  
      const playlist = response.data;
  
      setPlaylistData(playlist);
      setFilteredSongs(playlist.songs); // Songs should now have all details
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
    }
  };
  
  
  
  
  const fetchPlaylistId = (id) => {
    setPlaylistid(id);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setPlayedSongs((prev) => new Set([...prev, song._id]));
    setQueue(getSimilarSongs(song));
  };

  const getSimilarSongs = (song) => {
    if (!song || !filteredSongs.length) return [];
    return filteredSongs
      .filter((s) => s._id !== song._id && !playedSongs.has(s._id))
      .sort((a, b) => {
        let scoreA = (a.singer === song.singer) * 3 + (a.language === song.language) * 2 + (a.genre === song.genre);
        let scoreB = (b.singer === song.singer) * 3 + (b.language === song.language) * 2 + (b.genre === song.genre);
        return scoreB - scoreA;
      });
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

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredSongs(playlistid ? playlistData?.songs || [] : allSongs);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    setFilteredSongs(
      (playlistid ? playlistData?.songs : allSongs)?.filter(
        (song) =>
          song.title.toLowerCase().includes(lowercasedQuery) ||
          song.singer.toLowerCase().includes(lowercasedQuery) ||
          (song.mood && song.mood.toLowerCase().includes(lowercasedQuery)) ||
          (song.weather && song.weather.toLowerCase().includes(lowercasedQuery))
      )
    );
  };

  return (
    <div className="h-screen bg-[#121212] text-white">
      <div className="h-[90%] flex">
        <Sidebar_ fetchPlayListId={fetchPlaylistId} />
        <div className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] overflow-auto lg:w-[75%] lg:ml-0">
          <Navbar onSearch={handleSearch} />

          {playlistData ? (
  <PlaylistView 
    playlist={playlistData} 
    songs={filteredSongs} 
    playSong={playSong} 
    goBack={() => setPlaylistid(null)} 
  />
) : (
  <div className="mt-4">
    <h1 className="text-xl font-bold mb-2">All Songs</h1>
    <SongGrid songs={filteredSongs} playSong={playSong} />
  </div>
)}

        </div>
      </div>

      {currentSong && <Player song={currentSong} setSong={setCurrentSong} playNext={playNext} />}
    </div>
  );
};

export default Layout;
