import { Issue, IssueLabel } from "../generated/graphql";

export type IssueLabelResultType = { __typename?: "IssueLabel" } & Pick<
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

