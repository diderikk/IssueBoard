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

function App() {
  const { state } = useSnackBar();

  return (
    <div>
      <Router>
        <nav id="nav-bar">
          <div className="nav-bar-icons">
            <Link className="nav-bar-link" to="/">
              <img id="home-icon" src={homeIcon} alt="home icon" />
            </Link>
            <Link className="nav-bar-link" to="/issue-boards">
              <img
                id="board-icon"
                src={boardIcon}
                alt="board icon"
              />
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

            <Link className="nav-bar-link" to="/about">
              <Avatar
                name="Diderik Kramer"
                email="diderik.kramer@gmail.com"
                round="20px"
                size="2.2rem"
                textSizeRatio={2.2}
                color="grey"
              />
            </Link>
          </div>
        </nav>

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
      {(state.show || state.fadeOut) && 
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
      }
    </div>
  );
}

export default App;
