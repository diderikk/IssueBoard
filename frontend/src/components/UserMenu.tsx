import React from "react";
import "./UserMenu.css";
import profileIcon from "../assets/profile.png";
import logOutIcon from "../assets/logout.png";
import boardIcon from "../assets/board.png";
import groupsIcon from "../assets/groups.png";
import { useHistory } from "react-router";

export const UserMenu: React.FC = () => {
  const history = useHistory();
  return (
    <div id="user-menu">
      <div>
        <div className="user-menu-item">
          <img
            className="user-menu-icon"
            src={profileIcon}
            alt="profile icon"
          />
          Profile
        </div>
        <div
          className="user-menu-item"
          onClick={() => {
            history.push("/issue-boards");
          }}
        >
          <img className="user-menu-icon" src={boardIcon} alt="board icon" />
          Issue boards
        </div>
        <div className="user-menu-item" onClick={() => history.push("/groups")}>
          <img className="user-menu-icon" src={groupsIcon} alt="groups icon" />
          Groups
        </div>
      </div>
      <div className="user-menu-item">
        <img className="user-menu-icon" src={logOutIcon} alt="log out icon" />
        Log out
      </div>
    </div>
  );
};
