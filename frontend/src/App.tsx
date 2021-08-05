import "./App.css";
import { useSnackBar } from "./context/SnackBarContext";
import { PacmanLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useCurrentUserQuery } from "./graphql/generated/graphql";
import { UserResultType } from "./types/UserResultType.type";
import { UserContext } from "./context/UserContext";
import { AuthenticatedRouter } from "./components/AuthenticatedRouter";
import { NonAuthenticatedRouter } from "./components/NonAuthenticatedRouter";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  const { state } = useSnackBar();
  const [user, setUser] = useState<UserResultType | undefined>(undefined);
  const { data, loading } = useCurrentUserQuery();
  const authenticated: boolean = user ? true : false;
  const [prevAuth, setPrevAuth] = useState<boolean>(authenticated);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if(loading) return;
    if (data?.currentUser) {
      setUser(data.currentUser);
    }
    if(!data?.currentUser && !loading) setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.currentUser]);

  useEffect(() => {
    if (prevAuth === authenticated) return;
    setPrevAuth(authenticated);
  }, [authenticated, prevAuth]);

  useEffect(() => {
    if(user) setIsLoading(false);
  }, [user]);

  if (isLoading)
    return (
      <Router>
        <Switch>
          <Route
            render={() => (
              <div id="loading-container">
                <PacmanLoader color={"#f2d648"} loading={true} size={25} />
              </div>
            )}
          />
        </Switch>
      </Router>
    );

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        {user ? (
          <AuthenticatedRouter loading={isLoading} user={user} />
        ) : (
          <NonAuthenticatedRouter loading={isLoading} />
        )}
      </UserContext.Provider>
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
