import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import CreatePlaylistModal from "./CreatePlaylistModal";
import MashupCreator from "./MashupCreator";

const Sidebar_ = ({ fetchPlayListId }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showMashup, setShowMashup] = useState(false);

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
      .map((song) => song?.songId?.thumbnail)
      .filter(Boolean); // remove undefined/null thumbnails

    if (songThumbnails.length === 0) {
      return "default-playlist.png"; // No songs, show default
    }

    if (songThumbnails.length < 4) {
      return songThumbnails[0] || "default-playlist.png"; // 1-3 songs, show first song thumbnail
    }

    // If 4 or more songs, create collage
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;

    const size = 100;

    songThumbnails.slice(0, 4).forEach((src, index) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;

      img.onload = () => {
        const x = (index % 2) * size;
        const y = Math.floor(index / 2) * size;
        ctx.drawImage(img, x, y, size, size);

        // When all 4 images are loaded, generate collage URL
        if (index === 3) {
          const collageUrl = canvas.toDataURL("image/jpeg");
          const imgElement = document.getElementById(
            `playlist-thumbnail-${playlist._id}`
          );
          if (imgElement) {
            imgElement.src = collageUrl;
          }
        }
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
    });

    return songThumbnails[0] || "default-playlist.png"; // While loading collage, show first thumbnail
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
          </div>{" "}
          {/* <button
            className="cursor-pointer p-2 bg-blue-600 rounded-full hover:bg-blue-700"
            onClick={() => setShowMashup(!showMashup)}
          >
            <img
              src={
                "https://img.icons8.com/?size=100&id=wgEWOAimcv4d&format=png&color=FFFFFF"
              }
              className="w-8"
              alt="Create Mashup"
            />
          </button> */}
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
                onClick={() => fetchPlayListId(playlist._id)}
              >
                <img
                  id={`playlist-thumbnail-${playlist._id}`}
                  src={generatePlaylistThumbnail(playlist)}
                  alt={playlist.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{playlist.name}</p>
                  <p className="text-sm text-gray-400">Playlist</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No playlists found.</p>
          )}
        </div>
      </div>
      {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} />}
      {showMashup && <MashupCreator />}
    </div>
  );
};

export default Sidebar_;
