import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
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
import update from "immutability-helper";

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
  const [issues, setIssues] = useState<IssueResultType[]>(issueLabel.issues);
  const [hoveringIssue, setHoveringIssue] = useState<IssueResultType | null>(
    null
  );
  const { dispatch } = useSnackBar();
  const addIssue = () => {
    setShowIssueForm(true);
  };

  useEffect(() => {
    setIssues(issueLabel.issues);
  }, [issueLabel.issues])

  const moveIssueCard = async (issue: IssueResultType) => {
    await moveIssue({
      variables: {
        issueId: issue.id,
        issueLabelId: issueLabel.id,
      },
    });
  };

  const removeIssue = (issueId: string) => {
    setIssues((stateIssues) =>
      stateIssues.filter((issueTemp) => {
        if (!issueTemp) return false;
        return issueTemp.id !== issueId;
      })
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ isOver }, drop] = useDrop<DragItem, void, DragItem>(() => ({
    accept: "IssueCard",
    drop: ({ issueItem, issueLabelId, removeIssueFromPreviousLabel }): void => {
      if (issueLabel.id === issueLabelId) return;
      moveIssueCard(issueItem!);
      removeIssueFromPreviousLabel!(issueItem!.id);
      setIssues((stateIssues) => {
        if (stateIssues.includes(issueItem!)) return stateIssues;
        return [issueItem!, ...stateIssues];
      });
    },
    hover: ({ issueItem, issueLabelId }) => {
      if (issueLabel.id === issueLabelId) return;
      setHoveringIssue(issueItem!);
    },
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  }));

  useEffect(() => {
    if (!isOver) setHoveringIssue(null);
  }, [isOver]);

  const moveIssue1 = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (issues.length === 0) return;
      const dragIssue = issues[dragIndex];
      setIssues(
        update(issues, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragIssue],
          ],
        })
      );
    },
    [issues]
  );
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
            index={0}
            removeIssue={removeIssue}
            moveIssue={moveIssue1}
            setSelectedIssue={setSelectedIssue}
            issue={hoveringIssue}
            issueLabelId={issueLabel.id}
          />
        )}
        {issues.map((issue, index) => {
          if (!issue) return <div key={index}></div>;

          return (
            <IssueCard
              index={index}
              removeIssue={removeIssue}
              moveIssue={moveIssue1}
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
