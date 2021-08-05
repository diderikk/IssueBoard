import React from "react";
import { useHistory } from "react-router-dom";
import "./Home.css";

export const Home: React.FC = () => {
  const history = useHistory();
  return (
    <div id="home-container" className="container">
      <h1>Issue boards</h1>
      <p>Issue boards for developers!</p>
	  <div id="home-button-container">
		  <button className="home-button" onClick={() => history.push("/register")}>Register</button>
		  <button className="home-button" onClick={() => history.push("/login")}>Login</button>
	  </div>
    </div>
  );
};
