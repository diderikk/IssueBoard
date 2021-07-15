import { ApolloQueryResult } from "@apollo/client";
import { Exact, UserGroupsQuery } from "../graphql/generated/graphql";

export type GroupsRefetchType = ((variables?: Partial<Exact<{ [key: string]: never; }>> | undefined) => Promise<ApolloQueryResult<UserGroupsQuery>>)