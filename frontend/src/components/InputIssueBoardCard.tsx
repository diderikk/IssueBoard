import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  useCreateIssueBoardMutation,
} from "../graphql/generated/graphql";
import { IssueBoardsRefetch } from "../types/IssueBoardsRefetch.type";
import { useSnackBar } from "../context/SnackBarContext";

interface Props {
  refetch: IssueBoardsRefetch
    
}

export const InputIssueBoardCard: React.FC<Props> = ({ refetch }) => {
  const [showIssueBoardForm, setShowIssueBoardForm] = useState<boolean>(false);
  const [issueBoardName, setIssueBoardName] = useState<string>("");
  const { dispatch } = useSnackBar();
  const [createIssueBoard] = useCreateIssueBoardMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [showIssueBoardForm, inputRef]);

  const handleClick = () => {
    setShowIssueBoardForm(true);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCancel = () => {
    setShowIssueBoardForm(false);
    setIssueBoardName("");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIssueBoardName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({ type: "loading" });
    const response = await createIssueBoard({
      variables: { attributes: { name: issueBoardName } },
    });

    if (response.errors)
      dispatch({ type: "error", error: "Could not create issue board" });
    else {
      await refetch();
      dispatch({ type: "successful", description: "Issue board created" });
      handleCancel();
    }
  };

  if (!showIssueBoardForm) {
    return (
      <div
        className="issue-board-card"
        onClick={handleClick}
        style={{ background: "green" }}
      >
        <h1>+</h1>
      </div>
    );
  } else {
    return (
      <form id="board-form" onSubmit={handleSubmit}>
        <div className="card-form-container">
          <h4>Board name</h4>
          <input
            ref={inputRef}
            value={issueBoardName}
            onChange={handleChange}
            className="form-input"
            type="text"
            placeholder="Issue board title..."
            onLoad={() => inputRef.current?.focus()}
          />
          <div className="form-buttons">
            <button
              type="submit"
              className="form-button"
              disabled={issueBoardName.trim().length === 0}
            >
              Create
            </button>
            <button className="form-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }
};
