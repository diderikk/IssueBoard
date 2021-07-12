import React, { Dispatch, SetStateAction, useMemo, useRef } from "react";
import "./IssueCard.css";
import calendar from "../assets/calendar.png";
import { formattedDueDate } from "../util/formattedDueDate";
import { IssueResultType } from "../types/IssueResultType.type";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { DragItem } from "../types/dragItem.interface";

interface Props {
  issue: IssueResultType;
  index: number;
  issueLabelId: string;
  removeIssue: (issueIdBeingRemoved: string) => void;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
  moveIssue: (dragIndex: number, hoverIndex: number) => void;
}

export const IssueCard: React.FC<Props> = ({
  issue,
  issueLabelId,
  removeIssue,
  setSelectedIssue,
  index,
  moveIssue,
}) => {
  const formattedDate = useMemo(() => {
    const date = formattedDueDate(issue.dueDate!);
    if (date === "None") return "";
    return date;
  }, [issue.dueDate]);

  const ref = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drop] = useDrop<DragItem, void, DragItem>({
    accept: "IssueCard",
    hover(item, monitor){
      if(!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex! < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex! > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveIssue(dragIndex!, hoverIndex)

      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IssueCard",
    item: { issueItem: issue, issueLabelId, removeIssueFromPreviousLabel: removeIssue, index } as DragItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));


  const handleClick = () => {
    setSelectedIssue(issue);
  };

  drag(drop(ref));

  return (
    <div
      ref={ref}
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
