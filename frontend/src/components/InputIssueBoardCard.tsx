import React, { ChangeEvent, useEffect, useRef, useState } from "react";

export const InputIssueBoardCard: React.FC = () => {
  const [showIssueBoardForm, setShowIssueBoardForm] = useState<boolean>(false);
	const [issueBoardName, setIssueBoardName] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if(inputRef.current) inputRef.current.focus();
	}, [showIssueBoardForm, inputRef])

  const handleClick = () => {
    setShowIssueBoardForm(true);
		if(inputRef.current) inputRef.current.focus();
  };

  const handleCancel = () => {
    setShowIssueBoardForm(false);
		setIssueBoardName("");
  };

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setIssueBoardName(event.target.value);
	}
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
      <div id="board-form">
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
            <button className="form-button">Create</button>
            <button className="form-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
};
