import { IssueResultType } from "./IssueResultType.type";

export interface DragItem {
  issue?: IssueResultType;
  removeIssue?: (issueIdBeingRemoved: string) => void;
  issueLabelId?: string;
  isOver?: boolean;
}
