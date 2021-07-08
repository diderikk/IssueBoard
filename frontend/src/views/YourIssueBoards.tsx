import React, { useEffect, useState } from "react";
import "./YourIssueBoards.css";
import { useHistory } from "react-router-dom";
import {
  useDeleteIssueBoardMutation,
  useIssueBoardsQuery,
} from "../generated/graphql";
import { useSnackBar } from "../util/SnackBarContext";
import { InputIssueBoardCard } from "../components/InputIssueBoardCard";
import { IssueBoardResultType } from "../types/IssueBoardResultType.type";

export const YourIssueBoards: React.FC = () => {
  let { data, loading, error, refetch } = useIssueBoardsQuery();
  const history = useHistory();
  const { dispatch } = useSnackBar();
  const [deleteIssueBoard] = useDeleteIssueBoardMutation();
  const [runDispatch, setRunDispatch] = useState<boolean>(true);

  useEffect(() => {
    if (runDispatch) {
      if (loading) dispatch({ type: "loading" });
      else if (data) {
        dispatch({ type: "disabled" });
        setRunDispatch(false);
      } else if (error) {
        dispatch({ type: "error", error: "Could not load issue boards" });
        setRunDispatch(false);
      }
    }
  }, [data, loading, error, dispatch, runDispatch]);

  const handleIssueBoardClick = (issueBoardId: string) => {
    history.push(`/issue-board/${issueBoardId}`);
  };

  const handleDelete = async (issueBoard: IssueBoardResultType) => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm(`Are you sure you want to delete ${issueBoard?.name}?`) ===
      true
    ) {
      dispatch({ type: "loading" });
      const response = await deleteIssueBoard({
        variables: { issueBoardId: issueBoard?.id! },
      });

      if (!response.data?.deleteIssueBoard?.success)
        dispatch({ type: "error", error: "Could not delete board" });
      else {
        dispatch({ type: "successful", description: "Issue board deleted" });
        await refetch();
      }
    }
  };

  return (
    <div className="container">
      <h1>Your issue boards:</h1>
      <div className="issue-boards-container">
        <InputIssueBoardCard refetch={refetch} />
        {data?.notGroupIssueBoards.map((issueBoard) => {
          return (
            <div key={issueBoard.id} className="issue-board-card">
              <div
                className="board-name"
                onClick={() => handleIssueBoardClick(issueBoard.id)}
              >
                <h3>{issueBoard.name}</h3>
              </div>
              <div
                className="delete-board-card"
                onClick={() => handleDelete(issueBoard)}
              >
                <strong>Delete</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
