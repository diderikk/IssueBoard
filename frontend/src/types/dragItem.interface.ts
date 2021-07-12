import { IssueResultType } from "./IssueResultType.type";

export interface DragItem {
  issueItem?: IssueResultType;
  index?: number;
  removeIssueFromPreviousLabel?: (issueIdBeingRemoved: string) => void;
  issueLabelId?: string;
  isOver?: boolean;
}
