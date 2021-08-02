import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
} from "react";
import inviteIcon from "../assets/invite.png";
import "./IssueBoard.css";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { IssueBoardTitle } from "../components/IssueBoardTitle";
import {
  useAddUserToBoardMutation,
  useDeleteIssueBoardMutation,
  useIssueBoardQuery,
  useLeaveIssueBoardMutation,
} from "../graphql/generated/graphql";
import { IssueLabelCard } from "../components/IssueLabelCard";
import { useSnackBar } from "../context/SnackBarContext";
import { InputIssueLabel } from "../components/InputIssueLabel";
import { Sidebar } from "../components/Sidebar";
import { IssueResultType } from "../types/IssueResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";
import update from "immutability-helper";
import { UserResultType } from "../types/UserResultType.type";
import Avatar from "react-avatar";

interface Params {
  issueBoardId: string;
  groupId: string | undefined;
}

type Props = RouteComponentProps<Params>;

export const IssueBoard: React.FC<Props> = ({ match }) => {
  const { data, error, loading, refetch } = useIssueBoardQuery({
    variables: {
      id: match.params.issueBoardId,
    },
  });
  const [addUserToBoardMutation] = useAddUserToBoardMutation();
  const [leaveIssueBoardMutation] = useLeaveIssueBoardMutation();
  const [deleteIssueBoardMutation] = useDeleteIssueBoardMutation();
  const history = useHistory();
  const { dispatch } = useSnackBar();
  const [showLabelForm, setShowLabelForm] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueResultType | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [issueLabels, setIssueLabels] = useState<IssueLabelResultType[]>(() => {
    if (data?.issueBoard.issueLabels)
      return data.issueBoard.issueLabels
        .slice()
        .sort((a, b) => a.order - b.order);
    return [];
  });
  const [userList, setUserList] = useState<UserResultType[]>(
    () => data?.issueBoard.users!.slice()!
  );
  const [runDispatch, setRunDispatch] = useState<boolean>(true);

  const handleAddLabel = () => {
    setShowLabelForm(true);
  };

  useEffect(() => {
    if (runDispatch) {
      if (loading) dispatch({ type: "loading" });
      else if (data) {
        dispatch({ type: "disabled" });
        setRunDispatch(false);
      } else if (error) {
        dispatch({ type: "error", error: "Could not load issue board" });
        setRunDispatch(false);
      }
    }
  }, [data, loading, error, dispatch, runDispatch]);

  useEffect(() => {
    if (data?.issueBoard.users) setUserList(data.issueBoard.users.slice());
  }, [data?.issueBoard.users]);

  useEffect(() => {
    setIssueLabels(
      data?.issueBoard.issueLabels!.slice().sort((a, b) => a.order - b.order)!
    );
  }, [data?.issueBoard.issueLabels]);

  if (error) history.push("/404");

  const moveIssueLabel = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (issueLabels.length <= 1) return;
      const dragIssueLabel = issueLabels[dragIndex];
      setIssueLabels(
        update(issueLabels, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragIssueLabel],
          ],
        })
      );
    },
    [issueLabels]
  );

  const handleSumbit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inviteEmail.trim().length === 0) return;
    dispatch({ type: "loading" });
    const response = await addUserToBoardMutation({
      variables: {
        issueBoardId: match.params.issueBoardId,
        email: inviteEmail,
      },
    });

    if (!response.data?.addUserToBoard?.success) {
      dispatch({
        type: "error",
        error: "User not found or user already exists in board",
      });
      return;
    }

    dispatch({ type: "successful", description: "User added to board" });
    setUserList((prevList) => [...prevList, { name: "", email: inviteEmail }]);
    setInviteEmail("");
  };

  const handleInviteChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteLeave = async () => {
    if (data?.issueBoard.isOwner) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("Are you sure you want to delete this issue board?")) {
        dispatch({ type: "loading" });
        const response = await deleteIssueBoardMutation({
          variables: { issueBoardId: issueBoard?.id! },
          update(cache) {
            cache.evict({
              id: "ROOT_QUERY",
              fieldName: "notGroupIssueBoards",
            });
          },
        });
        if (!response.data?.deleteIssueBoard?.success) {
          dispatch({ type: "error", error: "Could not delete issue board" });
          return;
        }
        dispatch({ type: "successful", description: "Issue board deleted" });
        history.push("/issue-boards");
      }
    } else {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("Are you sure you want to leave this issue board?")) {
        dispatch({ type: "loading" });
        const response = await leaveIssueBoardMutation({
          variables: { issueBoardId: issueBoard?.id! },
          update(cache) {
            cache.evict({
              id: "ROOT_QUERY",
              fieldName: "notGroupIssueBoards",
            });
          },
        });
        if (!response.data?.leaveIssueBoard?.success) {
          dispatch({ type: "error", error: "Could not leave issue board" });
          return;
        }
        dispatch({ type: "successful" });
        history.push("/issue-boards");
      }
    }
  };

  const issueBoard = useMemo(() => data?.issueBoard, [data?.issueBoard]);

  return (
    <div className="container">
      {selectedIssue && (
        <Sidebar setSelectedIssue={setSelectedIssue} issue={selectedIssue} />
      )}
      <div id="issue-label-header">
        <input
          id="issue-label-search"
          value={searchQuery}
          type="text"
          placeholder="Search or filter results..."
          onChange={handleSearchChange}
        />
        <IssueBoardTitle
          issueBoardTitle={issueBoard?.name!}
          issueBoardId={match.params.issueBoardId}
        />
        <button onClick={handleAddLabel}>Add label</button>
        {!match.params.groupId && (
          <div id="user-list">
            {userList &&
              userList.map((user, index) => (
                <div
                  key={user.email}
                  className="user-avatar"
                  style={{ left: 17 * index }}
                >
                  <Avatar
                    name={user.email}
                    size="2.2rem"
                    round="20px"
                    textSizeRatio={2.0}
                  />
                </div>
              ))}
          </div>
        )}
        {!match.params.groupId && (
          <form id="invite-form" onSubmit={handleSumbit}>
            <div id="input-icon">
              <input
                id="invite-input"
                type="text"
                value={inviteEmail}
                placeholder="Email..."
                onChange={handleInviteChange}
              />
              <button id="invite-button" className="form-button" type="submit">
                <img id="invite-icon" src={inviteIcon} alt="invite icon" />
              </button>
            </div>
          </form>
        )}

        {!match.params.groupId && (
          <button
            id="leave-button"
            className="form-button"
            onClick={handleDeleteLeave}
          >
            {data?.issueBoard.isOwner ? "Delete" : "Leave"}
          </button>
        )}
      </div>
      <div className="issue-label-container">
        {issueLabels &&
          issueLabels.map((issueLabel, index) => {
            return (
              <IssueLabelCard
                refetch={refetch}
                index={index}
                moveIssueLabel={moveIssueLabel}
                setSelectedIssue={setSelectedIssue}
                issueLabel={issueLabel}
                key={issueLabel.id}
                searchQuery={searchQuery}
                color={issueLabel.color!}
              />
            );
          })}
        {showLabelForm && (
          <InputIssueLabel
            refetch={refetch}
            issueBoardId={data?.issueBoard.id!}
            setShowLabelForm={setShowLabelForm}
            labelNames={
              data?.issueBoard.issueLabels.map((label) => label.name)!
            }
          />
        )}
      </div>
    </div>
  );
};
