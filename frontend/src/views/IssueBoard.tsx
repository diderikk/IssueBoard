import React from "react";
import "./IssueBoard.css";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { IssueBoardTitle } from "../components/IssueBoardTitle";
import { useIssueBoardQuery } from "../generated/graphql";

interface Params {
  issueBoardId: string;
}

type Props = RouteComponentProps<Params>;

export const IssueBoard: React.FC<Props> = ({ match }) => {
  const { data, error } = useIssueBoardQuery({
    variables: {
      id: match.params.issueBoardId,
    },
  });
  const history = useHistory();

  if (error) history.push("/404");

  const issueBoard = data?.issueBoard;
  console.log(issueBoard);

  return (
    <div className="container">
      <div id="issue-label-header">
        <input type="text"/>
        <IssueBoardTitle issueBoardTitle={issueBoard?.name!} />
        <button>Create list</button>
      </div>
      <div className="issue-label-container">
        {issueBoard?.issueLabels.map((issueLabel) => {
          return (
            <div className="issue-label" key={issueLabel.id}>
              <h2>{issueLabel.name}</h2>
              <p>{issueLabel.color}</p>
            </div>
          );
        })}
      </div>
      {/* <IssueBoardTitle issueBoardTitle={issueBoard?.name!} /> */}
    </div>
  );
};
