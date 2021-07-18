import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import checkIcon from "../assets/check.png";
import crossIcon from "../assets/cross.png";
import { InputGroupCard } from "../components/InputGroupCard";
import { useSnackBar } from "../context/SnackBarContext";
import {
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useUserGroupsQuery,
  useUserInvitedGroupsQuery,
} from "../graphql/generated/graphql";
import { GroupsType } from "../types/GroupsType.type";
import "./Groups.css";

export const Groups: React.FC = () => {
  const groupsResponse = useUserGroupsQuery();
  const invitedResponse = useUserInvitedGroupsQuery();
  const { dispatch } = useSnackBar();
  const [invitedGroups, setInvitedGroups] = useState<GroupsType[]>(
    invitedResponse.data?.invitedToGroups!
  );
  const [groups, setGroups] = useState<GroupsType[]>(
    groupsResponse.data?.groups!
  );
  const [showGroupForm, setShowGroupForm] = useState<boolean>(false);
  const [runDispatch, setRunDispatch] = useState<boolean>(true);
  const [declineInvite] = useDeclineInviteMutation();
  const [acceptInvite] = useAcceptInviteMutation();
  const history = useHistory();

  useEffect(() => {
    if (runDispatch) {
      if (groupsResponse.loading) dispatch({ type: "loading" });
      else if (groupsResponse.data) {
        dispatch({ type: "disabled" });
        setRunDispatch(false);
      } else if (groupsResponse.error) {
        dispatch({ type: "error", error: "Could not load groups" });
        setRunDispatch(false);
      }
    }
  }, [groupsResponse, dispatch, runDispatch]);

  useEffect(() => {
    if (invitedResponse.data)
      setInvitedGroups(invitedResponse.data.invitedToGroups);
  }, [invitedResponse]);

  useEffect(() => {
    if (groupsResponse.data) setGroups(groupsResponse.data.groups);
  }, [groupsResponse]);

  const handleDecline = async (groupId: string) => {
    const response = await declineInvite({ variables: { groupId } });

    if (response.data?.declineInvite?.success) {
      setInvitedGroups((prevGroups) =>
        prevGroups.filter((prevGroup) => prevGroup.id !== groupId)
      );
    }
  };

  const handleAccept = async (group: GroupsType) => {
    const response = await acceptInvite({ variables: { groupId: group.id } });

    if (response.data?.acceptInvite?.success) {
      setInvitedGroups((prevGroups) =>
        prevGroups.filter((prevGroup) => prevGroup.id !== group.id)
      );
      setGroups((prevGroups) => {
        return [group, ...prevGroups];
      });
    }
  };

  return (
    <div id="groups-container">
      <div className="container">
        <span id="groups-header">
          <h1>Your groups</h1>
          <button onClick={() => setShowGroupForm(!showGroupForm)}>
            + Group
          </button>
        </span>
        {showGroupForm && (
          <InputGroupCard
            setShowGroupForm={setShowGroupForm}
            refetch={groupsResponse.refetch}
          />
        )}
        {groups &&
          groups.map((groupItem) => (
            <div
              className="group-card"
              key={groupItem.id}
              onClick={() => history.push(`/group/${groupItem.id}`)}
            >
              {groupItem.logo && <img src={groupItem.logo} alt="group logo" />}
              <h1>{groupItem.name}</h1>
            </div>
          ))}
      </div>
      <div id="invites-container">
        <h1>Invites</h1>
        {invitedGroups &&
          invitedGroups.map((invite) => (
            <div className="invite-card" key={invite.id}>
              <h3>{invite.name}</h3>
              <div className="invite-buttons">
                <img
                  id="check-icon"
                  src={checkIcon}
                  alt="check icon"
                  onClick={() => handleAccept(invite)}
                />
                <img
                  id="cross-icon"
                  src={crossIcon}
                  alt="cross icon"
                  onClick={() => handleDecline(invite.id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
