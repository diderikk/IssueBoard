import homeIcon from "../assets/home.png";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { About } from "../views/About";
import { Home } from "../views/Home";
import { Login } from "../views/Login";
import { Register } from "../views/Register";

interface Props {
  loading: boolean;
}

export const NonAuthenticatedRouter: React.FC<Props> = ({ loading }) => {
  return (
    <Router>
      {!loading && (
        <nav id="nav-bar">
          <div className="nav-bar-icons">
            <Link className="nav-bar-link" to="/">
              <img id="home-icon" src={homeIcon} alt="home icon" />
            </Link>
          </div>
          <h1>Issue Board</h1>

          <div className="nav-bar-icons">
            <Link className="nav-bar-link-text" to="/login">
              Login
            </Link>

            <Link className="nav-bar-link-text" to="/register">
              Register
            </Link>
          </div>
        </nav>
      )}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route render={() => <h1>404: Page not found</h1>} />
      </Switch>
    </Router>
  );
};
