import React, { Dispatch, SetStateAction } from "react";
import "./Sidebar.css";
import { IssueResultType } from "../types/IssueResultType.type";

interface Props {
  issue: IssueResultType | null;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
}

export const Sidebar: React.FC<Props> = ({ issue }) => {
  return (
    <div id="sidebar">
      <div id="sidebar-header">
        <div>
          <h4>{issue?.title}</h4>
          <p>#{issue?.issueId}</p>
        </div>
        <div id="sidebar-exit">
          <button id="sidebar-button">X</button>
        </div>
      </div>
    </div>
  );
};
