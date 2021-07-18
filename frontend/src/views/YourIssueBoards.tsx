import React, { useEffect, useState } from "react";
import "./YourIssueBoards.css";
import {
  useIssueBoardsQuery,
} from "../graphql/generated/graphql";
import { useSnackBar } from "../context/SnackBarContext";
import { IssueBoardList } from "../components/IssueBoardList";

export const YourIssueBoards: React.FC = () => {
  let { data, loading, error, refetch } = useIssueBoardsQuery();
  const { dispatch } = useSnackBar();
  const [runDispatch, setRunDispatch] = useState<boolean>(true);

  useEffect(() => {
    if (runDispatch) {
      if (loading) dispatch({ type: "loading" });
      else if (data) {
        dispatch({ type: "disabled" });
        setRunDispatch(false);
      } else if (error) {
        dispatch({ type: "error", error: "Could not load issue boards" });
        setRunDispatch(false);
      }
    }
  }, [data, loading, error, dispatch, runDispatch]);

  return (
    <div className="container">
      <h1>Your issue boards:</h1>
      <IssueBoardList refetch={refetch} issueBoardListProps={data?.notGroupIssueBoards} /> 
    </div>
  );
};
