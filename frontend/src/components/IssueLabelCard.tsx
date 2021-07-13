import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./IssueLabelCard.css";
import cards from "../assets/issue-cards.png";
import { IssueCard } from "./IssueCard";
import { InputIssueCard } from "./InputIssueCard";
import { IssueResultType } from "../types/IssueResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";
import {
  useDeleteIssueLabelMutation,
  useMoveIssueLabelMutation,
  useMoveIssueMutation,
} from "../graphql/generated/graphql";
import { useSnackBar } from "../context/SnackBarContext";
import { IssueBoardRefetch } from "../types/IssueBoardRefetch.type";
import { useDrag, useDrop } from "react-dnd";
import { DragIssueItem } from "../types/DragIssueItem.interface";
import update from "immutability-helper";
import { DragIssueLabelItem } from "../types/DragIssueLabelItem.interface";

interface Props {
  issueLabel: IssueLabelResultType;
  index: number;
  setSelectedIssue: Dispatch<SetStateAction<IssueResultType | null>>;
  refetch: IssueBoardRefetch;
  moveIssueLabel: (dragIndex: number, hoverIndex: number) => void;
}

export const IssueLabelCard: React.FC<Props> = ({
  issueLabel,
  index,
  setSelectedIssue,
  refetch,
  moveIssueLabel,
}) => {
  const [showIssueForm, setShowIssueForm] = useState<boolean>(false);
  const [deleteIssueLabel] = useDeleteIssueLabelMutation();
  const [moveIssueLabelMutation] = useMoveIssueLabelMutation();
  const [moveIssue] = useMoveIssueMutation();
  const [issues, setIssues] = useState<IssueResultType[]>(issueLabel.issues.slice().sort((a,b) => a.order - b.order));
  const [hoveringIssue, setHoveringIssue] = useState<IssueResultType | null>(
    null
  );
  const { dispatch } = useSnackBar();
  const addIssue = () => {
    setShowIssueForm(true);
  };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIssues(issueLabel.issues.slice().sort((a,b) => a.order - b.order));
  }, [issueLabel.issues]);

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
  const [{ isOver }, drop] = useDrop<DragIssueItem, void, DragIssueItem>(
    () => ({
      accept: "IssueCard",
      drop: ({
        issueItem,
        issueLabelId,
        removeIssueFromPreviousLabel,
      }): void => {
        if (issueLabel.id === issueLabelId) return;
        moveIssueCard(issueItem!);
        removeIssueFromPreviousLabel!(issueItem!.id);
        setIssues((stateIssues) => {
          if (stateIssues.includes(issueItem!)) return stateIssues;
          return [issueItem!, ...stateIssues];
        });
      },
      hover: (item) => {
        if (issueLabel.id === item.issueLabelId) {
          item.isOverAnotherLabel = false;
          return;
        }
        setHoveringIssue(item.issueItem!);
        item.isOverAnotherLabel = true;
      },
      collect(monitor) {
        return {
          isOver: monitor.isOver(),
        };
      },
    })
  );

  useEffect(() => {
    if (!isOver) setHoveringIssue(null);
  }, [isOver]);

  const moveIssueLocal = useCallback(
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

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IssueLabelCard",
    item: { index, issueLabelId: issueLabel.id } as DragIssueLabelItem,

    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dropIssueLabel] = useDrop<
    DragIssueLabelItem,
    void,
    DragIssueLabelItem
  >({
    accept: "IssueLabelCard",
    drop({issueLabelId}) {
      moveIssueLabelMutation({
        variables: {
          issueLabelId: issueLabelId!,
          newOrder: index + 1
        }
      })
    },
    hover(item) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveIssueLabel(dragIndex!, hoverIndex);

      item.index = hoverIndex;
    },
  });

  dropIssueLabel(drag(drop(ref)));

  return (
    <div
      className="issue-label"
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
    >
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
            moveIssue={moveIssueLocal}
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
              moveIssue={moveIssueLocal}
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
