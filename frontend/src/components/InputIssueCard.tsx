import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCreateIssueMutation } from "../generated/graphql";
import { IssueBoardRefetch } from "../types/IssueBoardRefetch.type";
import { useSnackBar } from "../util/SnackBarContext";
import "./IssueCard.css";

interface Props {
  setShowIssueForm: Dispatch<SetStateAction<boolean>>;
  issueLabelId: string;
  refetch: IssueBoardRefetch;
}

export const InputIssueCard: React.FC<Props> = ({
  setShowIssueForm,
  issueLabelId,
  refetch,
}) => {
  const [titleInput, setTitleInput] = useState<string>("");
  const [createIssue] = useCreateIssueMutation();
  const { dispatch } = useSnackBar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    setShowIssueForm(false);
    setTitleInput("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(event.target.value);
  };

  const handelCreate = async () => {
    dispatch({ type: "loading" });
    const response = await createIssue({
      variables: { attributes: { title: titleInput, issueLabelId } },
    });

    if (response.errors || response.data?.createIssue?.errors)
      dispatch({ type: "error", error: "Could not create issue" });
    else {
	  refetch();
      dispatch({ type: "successful", description: "Issue created" });
      setShowIssueForm(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="issue-card-container card-form-container">
      <h4>Title</h4>
      <input
        value={titleInput}
        ref={inputRef}
        className="form-input"
        type="text"
        onChange={handleChange}
      />
      <div className="form-buttons">
        <button
          className="form-button"
          disabled={titleInput.trim().length === 0}
		  onClick={handelCreate}
        >
          Create
        </button>
        <button className="form-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};
