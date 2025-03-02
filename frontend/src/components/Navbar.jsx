import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FaSearch } from "react-icons/fa";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore(); // Get user from auth store
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full flex items-center justify-between bg-[#121212] px-4 py-3 relative">
      {/* Left: Navigation Arrows */}
      <div className="flex items-center gap-3">
        <img
          src={assets.arrow_left}
          className="w-8 h-8 bg-[#1e1e1e] p-2 rounded-full cursor-pointer hover:bg-[#292929] transition"
          alt="Back"
          onClick={() => navigate(-1)}
        />
        <img
          src={assets.arrow_right}
          className="w-8 h-8 bg-[#1e1e1e] p-2 rounded-full cursor-pointer hover:bg-[#292929] transition"
          alt="Forward"
          onClick={() => navigate(+1)}
        />
      </div>

      {/* 🎵 Center: Search Bar */}
      <div className="relative flex items-center bg-[#1e1e1e] px-4 py-2 rounded-full w-[350px] max-w-md">
        <FaSearch className="text-gray-400 mr-2 text-lg" />
        <input
          type="text"
          placeholder="What do you want to play?"
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-transparent outline-none text-white w-full placeholder-gray-500"
        />
      </div>

      {/* Right: Profile Section */}
      <div className="relative">
        <div
          className="w-10 h-10 bg-purple-500 text-black font-bold flex items-center justify-center rounded-full cursor-pointer hover:opacity-80"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {user?.name?.charAt(0).toUpperCase() || "U"}{" "}
          {/* Dynamically set first letter */}
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-[#1e1e1e] rounded-lg shadow-lg py-2">
            <p
              className="px-4 py-2 text-white cursor-pointer hover:bg-[#292929] transition"
              onClick={() => navigate("/profile")}
            >
              Profile
            </p>
            <p
              className="px-4 py-2 text-white cursor-pointer hover:bg-[#292929] transition"
              onClick={handleLogout}
            >
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
