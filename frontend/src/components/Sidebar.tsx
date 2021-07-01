import React, { Dispatch, SetStateAction, useState } from "react";
import "./Sidebar.css";
import { IssueResultType } from "../types/IssueResultType.type";
import { formattedDueDate } from "../util/formattedDueDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  issue: IssueResultType | null;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
}

export const Sidebar: React.FC<Props> = ({ issue, setSelectedIssue }) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string>("");
  const handleExitClick = () => {
    setSelectedIssue(null);
  };

  const handleDateChange = (date: Date) => {
    setDueDate(date.toUTCString());
    // issue?.dueDate = date.toUTCString();
    setShowDatePicker(false);
  };

  const formattedDate = formattedDueDate(issue?.dueDate!);
  const currentDate = new Date();
  return (
    <div id="sidebar">
      <div className="sidebar-item">
        <div>
          <h4>{issue?.title}</h4>
          <p>#{issue?.issueId}</p>
        </div>
        <div id="sidebar-exit" onClick={handleExitClick}>
          <strong>x</strong>
        </div>
      </div>
      <div className="sidebar-item">
        <div>
          <p>Due date</p>
          <p>
            <strong>{formattedDate}</strong>{" "}
            <button id="sidebar-remove-date" className="button-link">
              remove due date
            </button>
          </p>
        </div>
        <button className="button-link" onClick={() => setShowDatePicker(true)}>
          Edit
        </button>
      </div>
      {showDatePicker && (
        <div id="datepicker-container">
          <DatePicker
            open={true}
            onChange={handleDateChange}
            minDate={currentDate}
            inline
          />
          <button
            id="datepicker-button"
            className="form-button"
            onClick={() => setShowDatePicker(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
