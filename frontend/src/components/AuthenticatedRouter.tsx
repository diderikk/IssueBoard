import { useState } from "react";
import homeIcon from "../assets/home.png";
import boardIcon from "../assets/board.png";
import groupsIcon from "../assets/groups.png";
import Avatar from "react-avatar";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { UserResultType } from "../types/UserResultType.type";
import { About } from "../views/About";
import { UserHome } from "../views/UserHome";
import { IssueBoard } from "../views/IssueBoard";
import { YourIssueBoards } from "../views/YourIssueBoards";
import { UserMenu } from "./UserMenu";
import { Groups } from "../views/Groups";
import { Group } from "../views/Group";

interface Props {
  loading: boolean;
  user: UserResultType | undefined;
}

export const AuthenticatedRouter: React.FC<Props> = ({ loading, user }) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  return (
    <Router>
      {!loading && (
        <nav id="nav-bar">
          <div className="nav-bar-icons">
            <Link className="nav-bar-link" to="/">
              <img id="home-icon" src={homeIcon} alt="home icon" />
            </Link>

            <Link className="nav-bar-link" to="/issue-boards">
              <img id="board-icon" src={boardIcon} alt="board icon" />
            </Link>

            <Link className="nav-bar-link" to="/groups">
              <img id="groups-icon" src={groupsIcon} alt="groups icon" />
            </Link>
          </div>
          <h1>Issue Board</h1>

          <div className="nav-bar-icons">
            <button
              className="nav-bar-link"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user && (
                <Avatar
                  name={user.name}
                  email={user.email}
                  round="20px"
                  size="2.2rem"
                  textSizeRatio={2.2}
                  color="grey"
                />
              )}
            </button>
          </div>
        </nav>
      )}
      {showUserMenu && <UserMenu />}

      <Switch>
        <Route path="/" exact component={UserHome} />
        <Route path="/about" component={About} />
        <Route path="/issue-boards" component={YourIssueBoards} />
        <Route path="/groups" component={Groups} />
        <Route path="/issue-board/:issueBoardId" component={IssueBoard} />
        <Route
          path="/group/:groupId/issue-board/:issueBoardId"
          component={IssueBoard}
        />
        <Route path="/group/:groupId" component={Group} />
        {!loading && <Route render={() => <h1>404: Page not found</h1>} />}
      </Switch>
    </Router>
  );
};
