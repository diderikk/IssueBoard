import "./App.css";
import { useSnackBar } from "./context/SnackBarContext";
import { PacmanLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useCurrentUserQuery } from "./graphql/generated/graphql";
import { UserResultType } from "./types/UserResultType.type";
import { UserContext } from "./context/UserContext";
import { AuthenticatedRouter } from "./components/AuthenticatedRouter";
import { NonAuthenticatedRouter } from "./components/NonAuthenticatedRouter";

function App() {
  const { state } = useSnackBar();
  const [user, setUser] = useState<UserResultType | undefined>(undefined);
  const { data, loading } = useCurrentUserQuery();
  const authenticated: boolean = user ? true : false;
  const [prevAuth, setPrevAuth] = useState<boolean>(authenticated);

  useEffect(() => {
    if (data?.currentUser) {
      setUser(data.currentUser);
    }
  }, [data?.currentUser, loading]);

  useEffect(() =>  {
    if(prevAuth === authenticated) return;
    setPrevAuth(authenticated);
  }, [authenticated, prevAuth]);

  if(loading) return <div></div>

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        {prevAuth ? (
          <AuthenticatedRouter loading={loading} user={user} />
        ) : (
          <NonAuthenticatedRouter loading={loading} />
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
