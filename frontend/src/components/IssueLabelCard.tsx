import React, { Dispatch, SetStateAction, useState } from "react";
import "./IssueLabelCard.css";
import cards from "../assets/issue-cards.png";
import { IssueCard } from "./IssueCard";
import { InputIssueCard } from "./InputIssueCard";
import { IssueResultType } from "../types/IssueResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";
import { useDeleteIssueLabelMutation } from "../generated/graphql";
import { useSnackBar } from "../util/SnackBarContext";
import { IssueBoardRefetch } from "../types/IssueBoardRefetch.type";
interface Props {
  issueLabel: IssueLabelResultType;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
  refetch: IssueBoardRefetch;
}

export const IssueLabelCard: React.FC<Props> = ({
  issueLabel,
  setSelectedIssue,
  refetch,
}) => {
  const [showIssueForm, setShowIssueForm] = useState<boolean>(false);
  const [deleteIssueLabel] = useDeleteIssueLabelMutation();
  const { dispatch } = useSnackBar();
  const addIssue = () => {
    setShowIssueForm(true);
  };

  const handleDeleteLabel = async () => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm(`Are you sure you want to delete issue label ${issueLabel.name}?`)
    ) {
      dispatch({ type: "loading" });
      const response = await deleteIssueLabel({
        variables: { issueLabelId: issueLabel.id },
      });

      if (!response.data?.deleteIssueLabel?.success)
        dispatch({ type: "error", error: "Could not delete issue label" });
      else {
        dispatch({ type: "successful", description: "Issue label deleted" });
        refetch();
      }
    }
  };

  return (
    <div className="issue-label">
      <div id="issue-label-card-header">
        <div className="issue-label-card-header-part">
          <h2>{issueLabel.name}</h2>
          <button className="label-card-button" onClick={handleDeleteLabel}>
            -
          </button>
        </div>
        <span className="issue-label-card-header-part">
          <img id="card-img" src={cards} alt="cards icon" />
          <h3>{issueLabel.issues.length}</h3>
          <button className="label-card-button" onClick={addIssue}>
            +
          </button>
        </span>
      </div>
      <div>
        {showIssueForm && (
          <InputIssueCard
            setShowIssueForm={setShowIssueForm}
            issueLabelId={issueLabel.id}
            refetch={refetch}
          />
        )}
        {issueLabel.issues.map((issue) => {
          return (
            <IssueCard
              setSelectedIssue={setSelectedIssue}
              issue={issue}
              key={issue.id}
            />
          );
        })}
      </div>
    </div>
  );
};
