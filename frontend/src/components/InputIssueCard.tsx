import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import './IssueCard.css'

interface Props {
	setShowIssueForm: Dispatch<SetStateAction<boolean>>;
}

export const InputIssueCard: React.FC<Props> = ({setShowIssueForm}) => {
	const [titleInput, setTitleInput] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleCancel = () => {
		setShowIssueForm(false);
		setTitleInput("");
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	}

	useEffect(() => {
		if(inputRef.current) inputRef.current.focus()
	},[])

	return (
		<div className="issue-card-container card-form-container">
			<h4>Title</h4>
			<input value={titleInput} ref={inputRef} className="form-input" type="text" onChange={handleChange}/>
			<div className="form-buttons">
				<button className="form-button" disabled={titleInput.trim().length === 0}>Create</button>
				<button className="form-button" onClick={handleCancel}>Cancel</button>
			</div>
		</div>
	)
}
