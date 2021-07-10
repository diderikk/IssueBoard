import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./IssueLabelCard.css";
import cards from "../assets/issue-cards.png";
import { IssueCard } from "./IssueCard";
import { InputIssueCard } from "./InputIssueCard";
import { IssueResultType } from "../types/IssueResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";
import {
  useDeleteIssueLabelMutation,
  useMoveIssueMutation,
} from "../graphql/generated/graphql";
import { useSnackBar } from "../context/SnackBarContext";
import { IssueBoardRefetch } from "../types/IssueBoardRefetch.type";
import { useDrop } from "react-dnd";
import { DragItem } from "../types/dragItem.interface";
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
  const [moveIssue] = useMoveIssueMutation();
  const [issues, setIssues] = useState<IssueResultType[]>(() => []);
  const [hoveringIssue, setHoveringIssue] = useState<
    IssueResultType | undefined
  >(undefined);
  const { dispatch } = useSnackBar();
  const addIssue = () => {
    setShowIssueForm(true);
  };

  useEffect(() => {
    if(issueLabel) setIssues(issueLabel.issues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[issueLabel.issues])


  console.log(issues, issueLabel.name)

  const moveIssueCard = async (
    issue: IssueResultType,
    previousIssueLabelId: string
  ) => {
    console.log(issues, "Hello1")
    setIssues([issue, ...issues]);
    await moveIssue({
      variables: {
        issueId: issue.id,
        issueLabelId: issueLabel.id,
      },
      update: (cache) => {
        cache.modify({
          id: `IssueLabel:${previousIssueLabelId}`,
          fields: {
            issues(existingIssues, { readField }) {
              console.log(existingIssues);
              return existingIssues.filter(
                (exIssue: IssueResultType) =>
                  issue.id !== readField("id", exIssue)
              );
            },
          },
        });
        cache.modify({
          id: `IssueLabel:${issueLabel.id}`,
          fields: {
            issues(existingIssues: IssueResultType[]) {
              return [issue, ...existingIssues];
            },
          },
        });
      },
    });
  };

  const removeIssue = (issueIdBeingRemoved: string) => {
    console.log("Called")
    setIssues(issues.filter((issue) => issue.id !== issueIdBeingRemoved));
  };

  const [{ isOver }, drop] = useDrop<DragItem, void, DragItem>(() => ({
    accept: "IssueCard",
    drop: ({ issue, issueLabelId, removeIssue }): void => {
      console.log(issues)
      removeIssue!(issue?.id!)
      moveIssueCard(issue!, issueLabelId!);
    },
    hover: ({ issue }) => {
      setHoveringIssue(issue);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (!isOver) setHoveringIssue(undefined);
  }, [isOver]);

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
        await refetch();
      }
    }
  };

  return (
    <div className="issue-label" ref={drop}>
      <div id="issue-label-card-header">
        <div className="issue-label-card-header-part">
          <h2>{issueLabel.name}</h2>
          <button className="label-card-button" onClick={handleDeleteLabel}>
            -
          </button>
        </div>
        <span className="issue-label-card-header-part">
          <img id="card-img" src={cards} alt="cards icon" />
          <h3>{issues.length}</h3>
          <button className="label-card-button" onClick={addIssue}>
            +
          </button>
        </span>
      </div>
      <div>
        {showIssueForm && (
          <InputIssueCard
            setSelectedIssue={setSelectedIssue}
            setShowIssueForm={setShowIssueForm}
            issueLabelId={issueLabel.id}
            refetch={refetch}
          />
        )}
        {isOver && hoveringIssue && (
          <IssueCard
            removeIssue={removeIssue}
            setSelectedIssue={setSelectedIssue}
            issue={hoveringIssue}
            issueLabelId={issueLabel.id}
            key={hoveringIssue.id}
          />
        )}
        {issues.map((issue) => {
          return (
            <IssueCard
              removeIssue={removeIssue}
              setSelectedIssue={setSelectedIssue}
              issue={issue}
              issueLabelId={issueLabel.id}
              key={issue.id}
            />
          );
        })}
      </div>
    </div>
  );
};
