import React, { useState } from "react";
import "./IssueLabelCard.css";
import { Issue, IssueLabel } from "../generated/graphql";
import cards from "../assets/issue-cards.png";
import { IssueCard } from "./IssueCard";
import { InputIssueCard } from "./InputIssueCard";

type IssueLabelResultType = { __typename?: "IssueLabel" } & Pick<
  IssueLabel,
  "id" | "name" | "color"
> & {
    issues: Array<
      { __typename?: "Issue" } & Pick<
        Issue,
        "id" | "title" | "issueId" | "dueDate"
      >
    >;
  };

interface Props {
  issueLabel: IssueLabelResultType;
}

export const IssueLabelCard: React.FC<Props> = ({ issueLabel }) => {
  const [showIssueForm, setShowIssueForm] = useState<boolean>(false)
  const addIssue = () => {
    setShowIssueForm(true);
  };

  return (
    <div className="issue-label">
      <div id="issue-label-card-header">
        <h2>{issueLabel.name}</h2>
        <span id="issue-label-card-header-right">
          <img id="card-img" src={cards} alt="cards icon" />
          <h3>{issueLabel.issues.length}</h3>
          <button id="plus-button" onClick={addIssue}>+</button>
        </span>
      </div>
      <div>
        {(showIssueForm) && <InputIssueCard setShowIssueForm={setShowIssueForm}/>}
        {issueLabel.issues.map((issue) => {
          return <IssueCard issue={issue} key={issue.id} />;
        })}
      </div>
    </div>
  );
};
