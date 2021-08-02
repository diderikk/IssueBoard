import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSnackBar } from "../context/SnackBarContext";
import { useCreateGroupMutation } from "../graphql/generated/graphql";
import { GroupsRefetchType } from "../types/GroupsRefetchType.type";

interface Props {
  setShowGroupForm: Dispatch<SetStateAction<boolean>>;
  refetch: GroupsRefetchType;
}

export const InputGroupCard: React.FC<Props> = ({ setShowGroupForm, refetch }) => {
  const [groupName, setGroupName] = useState<string>("");
  const [groupLogo, setGroupLogo] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useSnackBar();
  const [createGroupMutation] = useCreateGroupMutation();

  useEffect(() => {
    if(inputRef.current) inputRef.current.focus();
  }, [])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupLogo(event.target.value);
  };

  const handleCreate = async () => {
    dispatch({ type: "loading" });
    const response = await createGroupMutation({
      variables: { attributes: { name: groupName } },
    });

    if(response.data?.createGroup?.errors){
      dispatch({type: 'error', error: "Could not create group"});
      return;
    }
    refetch();
    dispatch({type: 'successful', description: `Group ${groupName} created`})
    setShowGroupForm(false);
  };

  return (
    <div id="input-group-card">
      <div className="group-input-fields">
        <div className="group-input">
          <h3>Group name </h3>
          <input
            ref={inputRef}
            name="groupName"
            value={groupName}
            type="text"
            className="form-input"
            placeholder="Group name..."
            onChange={handleNameChange}
          />
        </div>
        <div className="group-input">
          <h3>Group logo</h3>
          <input
            name="groupLogo"
            value={groupLogo}
            type="file"
            className="file-form-input"
            placeholder="Group logo"
            onChange={handleLogoChange}
          />
        </div>
      </div>
      <div id="group-input-buttons">
        <button className="form-button" onClick={handleCreate}>Create</button>
        <button className="form-button" onClick={() => setShowGroupForm(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};
