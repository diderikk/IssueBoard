import { ApolloQueryResult } from "@apollo/client";
import { Exact, IssueBoardsQuery } from "../generated/graphql";

export type IssueBoardsRefetch = (variables?: Partial<Exact<{ [key: string]: never }>> | undefined
  ) => Promise<ApolloQueryResult<IssueBoardsQuery>>;