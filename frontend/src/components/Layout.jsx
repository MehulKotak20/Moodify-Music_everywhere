import React from "react";
import Sidebar_ from "./Sidebar_";
import Navbar from "./Navbar";
import Player from "./Player";

const Layout = () => {
  return (
    <div className="h-screen">
      <div className="h-[90%] flex">
        <Sidebar_ />
        <div className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
          <Navbar />
          
        </div>
      </div>
      <Player/>
    </div>
  );
};

export default Layout;
