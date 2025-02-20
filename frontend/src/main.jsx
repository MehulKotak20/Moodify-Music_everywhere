import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SongProvider } from "./context/Song.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
		<SongProvider>
			<App />
		</SongProvider>	
		</BrowserRouter>
	</React.StrictMode>
);
