import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ColorPicker } from "./ColorPicker";

interface Props {
  setShowLabelForm: Dispatch<SetStateAction<boolean>>;
}

export const InputIssueLabel: React.FC<Props> = ({setShowLabelForm}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [labelName, setLabelName] = useState<string>("");
  const [labelColor, setLabelColor] = useState<string>("white");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelName(event.target.value);
  };

  const handleCancel = () => {
	setShowLabelForm(false);
  }

  return (
    <div className="issue-label">
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
      <div id="issue-form-buttons">
        <button className="issue-label-button">Add to board</button>
        <button className="issue-label-button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};
