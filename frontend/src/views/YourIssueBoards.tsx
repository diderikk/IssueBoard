import React, { useEffect } from "react";
import "./YourIssueBoards.css";
import { useHistory } from "react-router-dom";
import { useIssueBoardsQuery } from "../generated/graphql";
import { useSnackBar } from "../util/SnackBarContext";
import { InputIssueBoardCard } from "../components/InputIssueBoardCard";

export const YourIssueBoards: React.FC = () => {
  const { data, loading, error } = useIssueBoardsQuery();
  const history = useHistory();
  const { dispatch } = useSnackBar();

  useEffect(() => {
    if (loading) dispatch({ type: "loading" });
    else if (data) dispatch({ type: "disabled" });
    else if (error) dispatch({ type: "error", error: "Could not load your issue boards" });
  }, [data, loading, error, dispatch]);

  const handleIssueBoardClick = (issueBoardId: string) => {
    history.push(`/issue-board/${issueBoardId}`);
  };

  return (
    <div className="container">
      <h1>Your issue boards:</h1>
      <div className="issue-boards-container">
        <InputIssueBoardCard />
        {data?.notGroupIssueBoards.map((issueBoard) => {
          return (
            <div
              key={issueBoard.id}
              className="issue-board-card"
              onClick={() => handleIssueBoardClick(issueBoard.id)}
            >
              <h3>{issueBoard.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};
