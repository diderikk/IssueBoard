import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import "./Sidebar.css";
import { IssueResultType } from "../types/IssueResultType.type";
import { formattedDueDate } from "../util/formattedDueDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useDeleteIssueMutation,
  useEditIssueMutation,
} from "../graphql/generated/graphql";
import { useSnackBar } from "../context/SnackBarContext";

interface Props {
  issue: IssueResultType | null;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
  // Fix refetch
}

export const Sidebar: React.FC<Props> = ({ issue, setSelectedIssue }) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string>(issue?.dueDate!);
  const [editIssue] = useEditIssueMutation();
  const [deleteIssue] = useDeleteIssueMutation();
  const handleExitClick = () => {
    setSelectedIssue(null);
  };
  const { dispatch } = useSnackBar();
  const formattedDate = useMemo(
    () => formattedDueDate(dueDate),
    [dueDate]
  );

  const handleDateChange = async (date: Date) => {
    dispatch({ type: "loading" });
    setDueDate(date.toUTCString());
    const seletedDate = date.toUTCString();
    const response = await editIssue({
      variables: { issueID: issue?.id!, attributes: { title: "", dueDate: seletedDate } },
      update: (cache) => {
        cache.modify({
          id: `Issue:${issue?.id}`,
          fields: {
            dueDate() {
              return seletedDate;
            },
          },
        });
      },
    });
    setDueDate(date.toUTCString());
    if (!response.data?.editIssue?.errors) dispatch({ type: "disabled" });
    else dispatch({ type: "error", error: "Could not update due date" });
    setShowDatePicker(false);
  };

  const handleDelete = async () => {
    dispatch({ type: "loading" });
    const response = await deleteIssue({
      variables: { issueId: issue?.id! },
      update: (cache) => {
        cache.evict({ id: `Issue:${issue?.id}` });
      },
    });
    setSelectedIssue(null);
    if (response.data?.deleteIssue?.success)
      dispatch({ type: "successful", description: "Issue deleted" });
    else dispatch({ type: "error", error: "Could not delete issue" });
  };

  const currentDate = new Date();
  return (
    <div id="sidebar">
      <div>
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
          <button
            className="button-link"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
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
      <div className="container">
        <button
          id="sidebar-delete-button"
          className="form-button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
