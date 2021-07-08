import { User } from "../graphql/generated/graphql";

export type UserResultType = { __typename?: "User" } & Pick<
  User,
  "email" | "name"
>;
