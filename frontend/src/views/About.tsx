import React from "react";
import { useHelloQuery } from "../generated/graphql";

export const About: React.FC = () => {
  const response = useHelloQuery();



  if(response.loading) return (<div>loading...</div>)

  return (<div>{response.data?.hello}</div>)
};
