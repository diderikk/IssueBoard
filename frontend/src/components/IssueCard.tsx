import React, { useMemo } from "react";
import './IssueCard.css'
import calendar from '../assets/calendar.png'
import { Issue } from "../generated/graphql";

type IssueResultType = { __typename?: "Issue" } & Pick<
  Issue,
  "id" | "title" | "issueId" | "dueDate"
>;

interface Props {
  issue: IssueResultType;
}

export const IssueCard: React.FC<Props> = ({ issue }) => {
  const formattedDate = useMemo(() => {
    const date = new Date(issue.dueDate!);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Des",
    ];

    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  }, [issue.dueDate]);

  return (
    <div className="issue-card-container">
      <h4>{issue.title}</h4>
      <div id="issue-card-meta">
		  <p>#{issue.issueId}</p>
		  <img id="calendar-icon" src={calendar} alt="calendar icon" />
		  <strong>{formattedDate}</strong>
		  </div>
    </div>
  );
};
