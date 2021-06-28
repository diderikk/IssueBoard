import React, { useEffect, useRef, useState } from "react";

interface Props {
  issueBoardTitle: string;
}

export const IssueBoardTitle: React.FC<Props> = ({ issueBoardTitle }) => {
  const [isInput, setIsInput] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(issueBoardTitle);
  useEffect(() => setTitle(issueBoardTitle), [issueBoardTitle]);


  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [isInput]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleClick = () => {
    setIsInput(true);
  };

  if (!isInput) return <button onClick={handleClick}>{title}</button>;
  return (
    <input
      ref={inputRef}
      type="text"
      value={title}
      onChange={handleChange}
      onBlur={() => {
        setIsInput(false);
      }}

    />
  );
};
