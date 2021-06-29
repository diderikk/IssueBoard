import React from "react";
import "./YourIssueBoards.css";
import { useHistory } from "react-router-dom";
import { useIssueBoardsQuery } from "../generated/graphql";

export const YourIssueBoards: React.FC = () => {
  const { data } = useIssueBoardsQuery();
  const history = useHistory();

  const handleIssueBoardClick = (issueBoardId: string) => {
    history.push(`/issue-board/${issueBoardId}`);
  };

  console.log(data)

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
