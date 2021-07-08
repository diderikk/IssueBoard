import { ApolloQueryResult } from "@apollo/client";
import { Exact, IssueBoardQuery } from "../generated/graphql";

export type IssueBoardRefetch = (
  variables?: Partial<Exact<{ id: string }>> | undefined
) => Promise<ApolloQueryResult<IssueBoardQuery>>;
