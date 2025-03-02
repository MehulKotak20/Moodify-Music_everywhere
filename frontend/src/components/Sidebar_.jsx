import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Sidebar_ = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    axios
      .get("http://localhost:5000/api/playlist/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      })
      .then((res) => setPlaylists(res.data))
      .catch((err) => console.error("Error fetching playlists:", err));
  }, []);

  const generatePlaylistThumbnail = (playlist) => {
    const songThumbnails = playlist.songs
      .slice(0, 4)
      .map((song) => song.thumbnail || "default-song-image.jpg");

    if (songThumbnails.length === 0) {
      return "default-playlist.png";
    }

    if (songThumbnails.length === 1) {
      return songThumbnails[0]; // Single song thumbnail
    }

    // Create a collage dynamically if 2-4 songs
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;

    const size = 100;

    songThumbnails.forEach((src, index) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;

      img.onload = () => {
        const x = (index % 2) * size;
        const y = Math.floor(index / 2) * size;
        ctx.drawImage(img, x, y, size, size);

        // Only return data URL after all images are drawn
        if (index === songThumbnails.length - 1) {
          const collageUrl = canvas.toDataURL("image/jpeg");
          document.getElementById(`playlist-thumbnail-${playlist._id}`).src =
            collageUrl;
        }
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
    });

    // Default (while images load)
    return "default-playlist.png";
  };

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={assets.home_icon} className="w-6" alt="Home" />
          <p className="font-bold">Home</p>
        </div>
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={assets.search_icon} className="w-6" alt="Search" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      <div className="bg-[#121212] h-[85%] rounded overflow-auto scrollbar-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={assets.stack_icon} className="w-8" alt="Library" />
            <p className="font-semibold">Your Library</p>
          </div>
          <button
            className="cursor-pointer p-1"
            onClick={() => setShowModal((prev) => !prev)}
          >
            <img src={assets.plus_icon} className="w-8" alt="Create Playlist" />
          </button>
        </div>

        {/* Playlist List */}
        <div className="p-2 flex flex-col gap-2">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => navigate(`/playlist/${playlist._id}`)}
              >
                <img
                  id={`playlist-thumbnail-${playlist._id}`}
                  src={generatePlaylistThumbnail(playlist)}
                  alt={playlist.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{playlist.name}</p>
                  <p className="text-sm text-gray-400">
                    Playlist • {playlist.creator}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No playlists found.</p>
          )}
        </div>
      </div>

      {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Sidebar_;
