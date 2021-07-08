import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import homeIcon from "./assets/home.png";
import boardIcon from "./assets/board.png";
import informationIcon from "./assets/information.png";
import { useSnackBar } from "./util/SnackBarContext";
import { About } from "./views/About";
import { Home } from "./views/Home";
import { IssueBoard } from "./views/IssueBoard";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { YourIssueBoards } from "./views/YourIssueBoards";
import { PacmanLoader } from "react-spinners";
import Avatar from "react-avatar";
import { useEffect, useState } from "react";
import { UserMenu } from "./components/UserMenu";
import { useCurrentUserQuery } from "./generated/graphql";
import { UserResultType } from "./types/UserResultType.type";

function App() {
  const { state } = useSnackBar();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [user, setUser] = useState<UserResultType | null>(null);
  const { data, loading, error } = useCurrentUserQuery();
  const authenticated: boolean = data?.currentUser?.name ? true: false;
  console.log(authenticated, error)

  useEffect(() => {
    if(data?.currentUser) setUser(data.currentUser);
  }, [data?.currentUser])
  

  return (
    <div>
      <Router>
        {!loading && (
          <nav id="nav-bar">
            <div className="nav-bar-icons">
              <Link className="nav-bar-link" to="/">
                <img id="home-icon" src={homeIcon} alt="home icon" />
              </Link>
              { authenticated &&
                <Link className="nav-bar-link" to="/issue-boards">
                  <img id="board-icon" src={boardIcon} alt="board icon" />
                </Link>
              }
            </div>
            <h1>Issue Board</h1>
            { authenticated ? (
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
            ) : (
              <div className="nav-bar-icons">
                <Link className="nav-bar-link-text" to="/login">
                  Login
                </Link>

                <Link className="nav-bar-link-text" to="/register">
                  Register
                </Link>
              </div>
            )}
          </nav>
        )}
        {showUserMenu && <UserMenu />}

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/issue-boards" component={YourIssueBoards} />
          <Route path="/issue-board/:issueBoardId" component={IssueBoard} />
          <Route render={() => <h1>404: Page not found</h1>} />
        </Switch>
      </Router>
      {(state.show || state.fadeOut) && (
        <div
          id="snackbar"
          style={{ color: state.color }}
          className={state.fadeOut ? "snackbar-fade" : ""}
        >
          <h4>{state.description}</h4>
          {state.loading && (
            <PacmanLoader color={state.color} loading={true} size={15} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
