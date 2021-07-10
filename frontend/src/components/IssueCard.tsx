import React, { Dispatch, SetStateAction, useMemo } from "react";
import "./IssueCard.css";
import calendar from "../assets/calendar.png";
import { formattedDueDate } from "../util/formattedDueDate";
import { IssueResultType } from "../types/IssueResultType.type";
import { useDrag } from "react-dnd";
import { DragItem } from "../types/dragItem.interface";

interface Props {
  issue: IssueResultType;
  issueLabelId: string;
  removeIssue: (issueIdBeingRemoved: string) => void;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
}

export const IssueCard: React.FC<Props> = ({
  issue,
  issueLabelId,
  removeIssue,
  setSelectedIssue,
}) => {
  const formattedDate = useMemo(() => {
    const date = formattedDueDate(issue.dueDate!);
    if (date === "None") return "";
    return date;
  }, [issue.dueDate]);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "IssueCard",
    item: { issue: issue, issueLabelId, removeIssue } as DragItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    setSelectedIssue(issue);
  };

  return (
    <div
      ref={dragRef}
      className="issue-card-container"
      onClick={handleClick}
      style={{ opacity: isDragging ? 0 : 1 }}
    >
      <h4>{issue.title}</h4>
      <div id="issue-card-meta">
        <p>#{issue.issueId}</p>
        {formattedDate && (
          <img id="calendar-icon" src={calendar} alt="calendar icon" />
        )}
        <strong>{formattedDate}</strong>
      </div>
    </div>
  );
};
