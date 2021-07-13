import { IssueResultType } from "./IssueResultType.type";

export interface DragIssueItem {
  issueItem?: IssueResultType;
  index?: number;
  removeIssueFromPreviousLabel?: (issueIdBeingRemoved: string) => void;
  issueLabelId?: string;
  isOver?: boolean;
  isOverAnotherLabel?: boolean;
}
