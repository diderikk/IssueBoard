import React, { Dispatch, SetStateAction } from "react";
import "./IssueCard.css";
import calendar from "../assets/calendar.png";
import { formattedDueDate } from "../util/formattedDueDate";
import { IssueResultType } from "../types/IssueResultType.type";


interface Props {
  issue: IssueResultType;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
}

export const IssueCard: React.FC<Props> = ({ issue, setSelectedIssue }) => {
  const formattedDate = formattedDueDate(issue.dueDate!);

  const handleClick = () => {
    setSelectedIssue(issue);
  };

  return (
    <div className="issue-card-container" onClick={handleClick}>
      <h4>{issue.title}</h4>
      <div id="issue-card-meta">
        <p>#{issue.issueId}</p>
        <img id="calendar-icon" src={calendar} alt="calendar icon" />
        <strong>{formattedDate}</strong>
      </div>
    </div>
  );
};
