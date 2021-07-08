import React from "react";
import DatePicker from 'react-datepicker'

export const About: React.FC = () => {
  return (
    <div>
      About
      <DatePicker open={true} onChange={() => console.log("")} inline />
    </div>
  );
};
