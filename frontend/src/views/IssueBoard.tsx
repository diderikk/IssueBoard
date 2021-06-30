import React, { useEffect, useState } from "react";
import "./IssueBoard.css";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { IssueBoardTitle } from "../components/IssueBoardTitle";
import { useIssueBoardQuery } from "../generated/graphql";
import { IssueLabelCard } from "../components/IssueLabelCard";
import { useSnackBar } from "../util/SnackBarContext";
import { InputIssueLabel } from "../components/InputIssueLabel";

interface Params {
  issueBoardId: string;
}

type Props = RouteComponentProps<Params>;

export const IssueBoard: React.FC<Props> = ({ match }) => {
  const { data, error, loading } = useIssueBoardQuery({
    variables: {
      id: match.params.issueBoardId,
    },
  });
  const history = useHistory();
  const { dispatch } = useSnackBar();
  const [showLabelForm, setShowLabelForm] = useState<boolean>(false);

  const handleAddLabel = () => {
    setShowLabelForm(true);
  };

  useEffect(() => {
    if (loading) dispatch({ type: "loading" });
    else if (data) dispatch({ type: "successful" });
    else if (error) dispatch({ type: "error", error: error.message });
  }, [data, loading, error, dispatch]);

  if (error) history.push("/404");

  const issueBoard = data?.issueBoard;

  return (
    <div className="container">
      <div id="issue-label-header">
        <input
          id="issue-label-search"
          type="text"
          placeholder="Search or filter results..."
        />
        <IssueBoardTitle issueBoardTitle={issueBoard?.name!} />
        <button onClick={handleAddLabel}>Add label</button>
      </div>
      <div className="issue-label-container">
        {issueBoard?.issueLabels.map((issueLabel) => {
          return <IssueLabelCard issueLabel={issueLabel} key={issueLabel.id} />;
        })}
        {showLabelForm && <InputIssueLabel setShowLabelForm={setShowLabelForm} />}
      </div>
    </div>
  );
};
