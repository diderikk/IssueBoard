import { Issue } from "../generated/graphql";

export type IssueResultType = { __typename?: "Issue" } & Pick<
  Issue,
  "id" | "title" | "issueId" | "dueDate"
>;