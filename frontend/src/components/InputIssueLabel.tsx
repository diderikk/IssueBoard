import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCreateIssueLabelMutation } from "../generated/graphql";
import { IssueBoardRefetch } from "../types/IssueBoardRefetch.type";
import { useSnackBar } from "../util/SnackBarContext";
import { ColorPicker } from "./ColorPicker";

interface Props {
  issueBoardId: string;
  setShowLabelForm: Dispatch<SetStateAction<boolean>>;
  refetch: IssueBoardRefetch
  labelNames: string[];
}

export const InputIssueLabel: React.FC<Props> = ({
  issueBoardId,
  setShowLabelForm,
  refetch,
  labelNames
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [labelName, setLabelName] = useState<string>("");
  const [labelColor, setLabelColor] = useState<string>("");
  const { dispatch } = useSnackBar();
  const [createIssueLabel] = useCreateIssueLabelMutation();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({ type: "loading" });
    const response = await createIssueLabel({
      variables: {
        attributes: { name: labelName, color: labelColor, issueBoardId },
      },
    });

    if (response.errors || response.data?.createIssueLabel?.errors) {
      dispatch({ type: "error", error: "Could not create issue label" });
    } else {
      dispatch({ type: "successful", description: "Issue label created" });
      setShowLabelForm(false);
      refetch();
    }
  };

  const validateLabelName = useMemo(() => {
    return labelNames.includes(labelName)
  }, [labelNames, labelName])

  return (
    <form className="issue-label" onSubmit={handleSubmit}>
      <div id="issue-label-card-header">
        <h2>New label</h2>
      </div>
      <div id="label-form">
        <h3>Label name</h3>
        <input
          type="text"
          placeholder="Label name..."
          ref={inputRef}
          value={labelName}
          onChange={handleNameChange}
        />
        <div id="color-label-block">
          <h3>Label color</h3>
          <div className="color-block" style={{ background: labelColor }}></div>
        </div>
        <ColorPicker labelColor={labelColor} setLabelColor={setLabelColor} />
      </div>
      <div id="label-form-buttons" className="form-buttons">
        <button
          className="form-button"
          disabled={(labelName.trim().length === 0) || validateLabelName}
          type="submit"
        >
          Add to board
        </button>
        <button className="form-button" onClick={() => setShowLabelForm(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
};
