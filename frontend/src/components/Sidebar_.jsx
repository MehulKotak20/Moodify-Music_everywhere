import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import CreatePlaylistModal from "./CreatePlaylistModal"; // Import modularized component

const Sidebar_ = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div className="flex items-center gap-3 pl-8 cursor-pointer" onClick={() => navigate("/")}>
          <img src={assets.home_icon} className="w-6" alt="" />
          <p className="font-bold">Home</p>
        </div>
        <div className="flex items-center gap-3 pl-8 cursor-pointer" onClick={() => navigate("/")}>
          <img src={assets.search_icon} className="w-6" alt="" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      <div className="bg-[#121212] h-[85%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={assets.stack_icon} className="w-8" alt="" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img src={assets.arrow_icon} className="w-8" alt="" />
            <button
  className="cursor-pointer p-1"
  onClick={() => {
    console.log("Plus icon clicked!"); // Debug
    setShowModal((prev) => !prev); // Toggle state properly
  }}
>
  <img src={assets.plus_icon} className="w-8" alt="Create Playlist" />
</button>


          </div>
        </div>

        <div onClick={() => navigate("/playlist")}>
          <PlayListCard />
        </div>

        <div className="p-4 m-2 bg-[#121212] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
          <h1>Find some podcasts to follow</h1>
          <p className="font-light">We'll keep you updated on new episodes</p>

          <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4">
            Browse Podcasts
          </button>
        </div>
      </div>

      {/* Playlist Creation Modal */}
      {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Sidebar_;
