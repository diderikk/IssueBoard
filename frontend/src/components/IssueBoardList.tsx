import React, { useEffect, useState } from "react";
import "../views/YourIssueBoards.css";
import { useHistory } from "react-router-dom";
import { useSnackBar } from "../context/SnackBarContext";
import { useDeleteIssueBoardMutation } from "../graphql/generated/graphql";
import { IssueBoardResultType } from "../types/IssueBoardResultType.type";
import { IssueBoardsRefetch } from "../types/IssueBoardsRefetch.type";
import { InputIssueBoardCard } from "./InputIssueBoardCard";
import { GroupRefetch } from "../types/GroupRefetch.type";

interface Props {
  issueBoardListProps: IssueBoardResultType[] | undefined;
  refetch: IssueBoardsRefetch | GroupRefetch;
  groupId?: string;
}

export const IssueBoardList: React.FC<Props> = ({
  issueBoardListProps,
  refetch,
  groupId,
}) => {
  const [issueBoards, setIssueBoards] = useState<IssueBoardResultType[]>(() => {
    if (issueBoardListProps) return issueBoardListProps.slice();
    return [];
  });
  const history = useHistory();
  const [deleteIssueBoard] = useDeleteIssueBoardMutation();
  const { dispatch } = useSnackBar();

  useEffect(() => {
    if (issueBoardListProps) setIssueBoards(issueBoardListProps.slice());
  }, [issueBoardListProps]);

  const handleIssueBoardClick = (issueBoardId: string) => {
    groupId
      ? history.push(`/group/${groupId}/issue-board/${issueBoardId}`)
      : history.push(`/issue-board/${issueBoardId}`);
  };

  const handleDelete = async (issueBoard: IssueBoardResultType) => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm(`Are you sure you want to delete ${issueBoard?.name}?`) === true
    ) {
      dispatch({ type: "loading" });
      const response = await deleteIssueBoard({
        variables: { issueBoardId: issueBoard?.id! },
      });

      if (!response.data?.deleteIssueBoard?.success)
        dispatch({ type: "error", error: "Could not delete board" });
      else {
        dispatch({ type: "successful", description: "Issue board deleted" });
        setIssueBoards((prevIssueBoardList) =>
          prevIssueBoardList.filter(
            (tempBoard) => tempBoard!.id !== issueBoard?.id
          )
        );
      }
    }
  };

  return (
    <div className="issue-boards-container">
      <InputIssueBoardCard refetch={refetch} groupId={groupId} />
      {issueBoards.map((issueBoard) => {
        return (
          <div key={issueBoard!.id} className="issue-board-card">
            <div
              className="board-name"
              onClick={() => handleIssueBoardClick(issueBoard!.id)}
            >
              <h3>{issueBoard!.name}</h3>
            </div>
            {issueBoard?.isOwner && <div
              className="delete-board-card"
              onClick={() => handleDelete(issueBoard)}
            >
              <strong>Delete</strong>
            </div>}
          </div>
        );
      })}
    </div>
  );
};
