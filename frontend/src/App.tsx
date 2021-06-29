import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import { About } from "./views/About";
import { Home } from "./views/Home";
import { IssueBoard } from "./views/IssueBoard";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { YourIssueBoards } from "./views/YourIssueBoards";

function App() {
  return (
    <Router>
      <nav id="navBar">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/about">About</Link>
        <Link to="/register">Register</Link>
        <Link to="/issue-boards">IssueBoards</Link>
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
  );
}

export default App;
