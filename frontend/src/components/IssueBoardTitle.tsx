import React, { useEffect, useRef, useState } from "react";
import { useEditIssueBoardMutation } from "../graphql/generated/graphql";

interface Props {
  issueBoardId: string;
  issueBoardTitle: string;
}

export const IssueBoardTitle: React.FC<Props> = ({
  issueBoardTitle,
  issueBoardId,
}) => {
  const [isInput, setIsInput] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(issueBoardTitle);
  const [editIssueBoard] = useEditIssueBoardMutation();

  useEffect(() => setTitle(issueBoardTitle), [issueBoardTitle]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInput]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleClick = () => {
    setIsInput(true);
  };

  const handleBlur = async () => {
    setIsInput(false);
    if (title === issueBoardTitle) return;
    else if (title.trim().length === 0) setTitle(issueBoardTitle);
    else {
      const response = await editIssueBoard({
        variables: { issueBoardId: issueBoardId, attributes: { name: title } },
      });

      if(response.errors) setTitle(issueBoardTitle);
    }
  };

  if (!isInput)
    return (
      <button onClick={handleClick}>
        <strong>{title}</strong>
      </button>
    );
  return (
    <input
      ref={inputRef}
      type="text"
      value={title}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
