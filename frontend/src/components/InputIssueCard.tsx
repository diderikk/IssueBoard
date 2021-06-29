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
		<div id="issue-card-input-container" className="issue-card-container">
			<h4>Title</h4>
			<input value={titleInput} ref={inputRef} id="issue-card-input" type="text" onChange={handleChange}/>
			<div id="issue-card-form-buttons">
				<button className="issue-card-button" disabled={titleInput.trim().length === 0}>Create</button>
				<button className="issue-card-button" onClick={handleCancel}>Cancel</button>
			</div>
		</div>
	)
}
