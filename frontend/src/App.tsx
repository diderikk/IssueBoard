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
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data, loading } = useCurrentUserQuery();
  const authenticated: boolean = user ? true : false;

  useEffect(() => {
    if (data?.currentUser) {
      setUser(data.currentUser);
    }
    // setIsLoading(loading)
  }, [data?.currentUser, loading]);

  if(loading) return <div></div>

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        {authenticated ? (
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
