import React, { ChangeEvent, useEffect, useState } from "react";
import "./Group.css";
import inviteIcon from "../assets/invite.png";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { IssueBoardList } from "../components/IssueBoardList";
import { useSnackBar } from "../context/SnackBarContext";
import {
  useGroupQuery,
  useInviteMutation,
  useLeaveGroupMutation,
} from "../graphql/generated/graphql";
import Avatar from "react-avatar";
import { UserResultType } from "../types/UserResultType.type";
import { useApolloClient } from "@apollo/client";

interface Params {
  groupId: string;
}

type Props = RouteComponentProps<Params>;

export const Group: React.FC<Props> = ({ match }) => {
  //Should be devided up in two queries for users and issueBoards seperately
  const { data, loading, error, refetch } = useGroupQuery({
    variables: { groupId: match.params.groupId },
  });
  const [inviteMutation] = useInviteMutation();
  const [leaveMutation] = useLeaveGroupMutation();
  const [runDispatch, setRunDispatch] = useState<boolean>(true);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [memberList, setMemberList] = useState<UserResultType[]>(() => {
    if (data?.group.users) return data.group.users.slice();
    return [];
  });
  const { dispatch } = useSnackBar();
  const history = useHistory();
  const client = useApolloClient()
  console.log(client.cache);
  

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
    if (data?.group.users) setMemberList(data.group.users);
  }, [data?.group.users]);

  const handleLeave = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to leave this group?")) {
      await leaveMutation({
        variables: { groupId: match.params.groupId },
        update(cache) {
          cache.evict({
            id: "ROOT_QUERY",
            fieldName: "groups"
          })
        },
      });
      history.push("/groups");
    }
  };

  const handleInviteChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  };

  const handleSumbit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inviteEmail.trim().length === 0) return;
    dispatch({ type: "loading" });
    const response = await inviteMutation({
      variables: { groupId: match.params.groupId, userEmail: inviteEmail },
    });

    if (!response.data?.invite?.success) {
      dispatch({
        type: "error",
        error: "User not found or user already exists in group",
      });
      return;
    }

    dispatch({ type: "successful", description: "User added to group" });
    setInviteEmail("");
  };

  return (
    <div>
      <div id="group-header">
        <h1 id="group-title">{data?.group.name}</h1>

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
        <button id="leave-button" className="form-button" onClick={handleLeave}>
          Leave
        </button>
      </div>
      <div id="group-container">
        <div className="container">
          <h1>Issue boards</h1>
          <IssueBoardList
            issueBoardListProps={data?.group.issueBoards}
            refetch={refetch}
            groupId={match.params.groupId}
          />
        </div>
        <div id="group-member-list">
          <h2>Members</h2>
          {memberList.map((user) => (
            <div className="user" key={user.email}>
              <Avatar
                name={user.email}
                size="2.2rem"
                round="20px"
                textSizeRatio={2.0}
              />
              <p className="username-text">{user.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
