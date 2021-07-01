import React, { Dispatch, SetStateAction, useState } from "react";
import "./IssueLabelCard.css";
import cards from "../assets/issue-cards.png";
import { IssueCard } from "./IssueCard";
import { InputIssueCard } from "./InputIssueCard";
import { IssueResultType } from "../types/IssueResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";
interface Props {
  issueLabel: IssueLabelResultType;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
}

export const IssueLabelCard: React.FC<Props> = ({ issueLabel, setSelectedIssue }) => {
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
          return <IssueCard setSelectedIssue={setSelectedIssue} issue={issue} key={issue.id} />;
        })}
      </div>
    </div>
  );
};
