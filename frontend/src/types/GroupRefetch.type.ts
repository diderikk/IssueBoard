import { ApolloQueryResult } from "@apollo/client";
import { Exact, GroupQuery } from "../graphql/generated/graphql";

export type GroupRefetch = (
  variables?:
    | Partial<
        Exact<{
          groupId: string;
        }>
      >
    | undefined
) => Promise<ApolloQueryResult<GroupQuery>>;
