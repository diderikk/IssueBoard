import { ApolloQueryResult } from "@apollo/client";
import { Exact, IssueBoardQuery } from "../graphql/generated/graphql";

export type IssueBoardRefetch = (
  variables?: Partial<Exact<{ id: string }>> | undefined
) => Promise<ApolloQueryResult<IssueBoardQuery>>;
