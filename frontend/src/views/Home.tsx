import React from "react";
import "./Home.css";
import boardIcon from "../assets/board.png";
import groupsIcon from "../assets/groups.png";
import { useHistory } from "react-router";

export const Home: React.FC = () => {
  const history = useHistory();

  return (
    <div id="home-container">
      <div>
        <h2 className="home-label">Your boards</h2>
        <button
          className="home-button"
          onClick={() => history.push("/issue-boards")}
        >
          <img className="home-icon" src={boardIcon} alt="board icon" />
        </button>
      </div>
      <div>
        <h2 className="home-label">Your groups</h2>
        <button className="home-button">
          <img className="home-icon" src={groupsIcon} alt="board icon" />
        </button>
      </div>
    </div>
  );
};
