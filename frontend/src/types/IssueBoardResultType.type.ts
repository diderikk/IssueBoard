import { IssueBoard } from "../graphql/generated/graphql"

export type IssueBoardResultType = ({
    __typename?: "IssueBoard";
} & Pick<IssueBoard, "name" | "id" | "isOwner">) | undefined