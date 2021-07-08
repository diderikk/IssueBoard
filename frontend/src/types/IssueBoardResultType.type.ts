import { IssueBoard } from "../generated/graphql"

export type IssueBoardResultType = ({
    __typename?: "IssueBoard";
} & Pick<IssueBoard, "name" | "id">) | undefined