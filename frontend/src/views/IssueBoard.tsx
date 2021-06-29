import React from "react";
import "./IssueBoard.css";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { IssueBoardTitle } from "../components/IssueBoardTitle";
import { useIssueBoardQuery } from "../generated/graphql";
import { IssueLabelCard } from "../components/IssueLabelCard";

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
        <input id="issue-label-search" type="text" placeholder="Search or filter results..."/>
        <IssueBoardTitle issueBoardTitle={issueBoard?.name!} />
        <button>Add label</button>
      </div>
      <div className="issue-label-container">
        {issueBoard?.issueLabels.map((issueLabel) => {
          return (
            <IssueLabelCard issueLabel={issueLabel} key={issueLabel.id} />
          );
        })}
      </div>
    </div>
  );
};
