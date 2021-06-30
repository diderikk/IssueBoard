import React, { Dispatch, SetStateAction } from "react";

interface Props {
  labelColor: string;
  setLabelColor: Dispatch<SetStateAction<string>>;
}

export const ColorPicker: React.FC<Props> = ({ labelColor, setLabelColor }) => {
  const colors = [
    "#009966",
    "#8fbc8f",
    "#3cb371",
    "#00b140",
    "#013220",
    "#6699cc",
    "#0000ff",
    "#e6e6fa",
    "#9400d3",
    "#330066",
    "#808080",
    "#36454f",
    "#f7e7ce",
    "#c21e56",
    "#cc338b",
    "#dc143c",
    "#ff0000",
    "#cd5b45",
    "#eee600",
    "#ed9121",
    "#c39953",
  ];

  const handleClick = (color: string) => {
    setLabelColor(color);
  };

  return (
    <div id="label-color-picker">
      {colors.map((color) => {
        return (
          <div
            className={`color-block ${(color === labelColor) ? "color-block-selected": ""}`}
            style={{ background: color }}
            onClick={() => handleClick(color)}
          ></div>
        );
      })}
    </div>
  );
};
