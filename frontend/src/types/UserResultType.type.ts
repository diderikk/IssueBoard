import { User } from "../generated/graphql";

export type UserResultType = { __typename?: "User" } & Pick<
  User,
  "email" | "name"
>;
