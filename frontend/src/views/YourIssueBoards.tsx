import React, { useEffect } from "react";
import "./YourIssueBoards.css";
import { useHistory } from "react-router-dom";
import { useIssueBoardsQuery } from "../generated/graphql";
import { useSnackBar } from "../util/SnackBarContext";

export const YourIssueBoards: React.FC = () => {
  const { data, loading, error } = useIssueBoardsQuery();
  const history = useHistory();
  const { dispatch } = useSnackBar();

  useEffect(() => {
    if (loading) dispatch({ type: "loading" });
    else if (data) dispatch({ type: "successful" });
    else if (error) dispatch({ type: "error", error: error.message });
  }, [data, loading, error, dispatch]);

  const handleIssueBoardClick = (issueBoardId: string) => {
    history.push(`/issue-board/${issueBoardId}`);
  };

  console.log(data);

  return (
    <div className="container">
      <h1>Your issue boards:</h1>
      <div className="issue-boards-container">
        {data?.notGroupIssueBoards.map((issueBoard) => {
          return (
            <div
              key={issueBoard.id}
              className="issue-board"
              onClick={() => handleIssueBoardClick(issueBoard.id)}
            >
              {issueBoard.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
