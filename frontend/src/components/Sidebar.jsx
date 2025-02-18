import React from "react";

const Sidebar = ({ setSelectedSection, logout }) => {
  return (
    <div className="w-64 bg-purple-900 text-white flex flex-col">
      <h1 className="text-xl font-bold p-4">🎵 Music Admin</h1>
      <nav className="flex flex-col gap-2 p-4">
        <button
          onClick={() => setSelectedSection("details")}
          className="text-left py-2 px-4 rounded hover:bg-purple-700"
        >
          Details
        </button>
        <button
          onClick={() => setSelectedSection("songs")}
          className="text-left py-2 px-4 rounded hover:bg-purple-700"
        >
          Songs
        </button>
        <button
          onClick={logout}
          className="text-left py-2 px-4 rounded hover:bg-purple-700"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
