import { useState } from "react";
import homeIcon from "../assets/home.png";
import boardIcon from "../assets/board.png";
import informationIcon from "../assets/information.png";
import Avatar from "react-avatar";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { UserResultType } from "../types/UserResultType.type";
import { About } from "../views/About";
import { Home } from "../views/Home";
import { IssueBoard } from "../views/IssueBoard";
import { YourIssueBoards } from "../views/YourIssueBoards";
import { UserMenu } from "./UserMenu";

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
          </div>
          <h1>Issue Board</h1>

          <div className="nav-bar-icons">
            <Link className="nav-bar-link" to="/about">
              <img
                id="about-icon"
                src={informationIcon}
                alt="information icon"
              />
            </Link>

            <button
              className="nav-bar-link"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Avatar
                name={user!.name}
                email={user!.email}
                round="20px"
                size="2.2rem"
                textSizeRatio={2.2}
                color="grey"
              />
            </button>
          </div>
        </nav>
      )}
      {showUserMenu && <UserMenu />}

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />

        <Route path="/issue-boards" component={YourIssueBoards} />
        <Route path="/issue-board/:issueBoardId" component={IssueBoard} />
        {!loading && <Route render={() => <h1>404: Page not found</h1>} />}
      </Switch>
    </Router>
  );
};