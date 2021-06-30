import React, { useState } from "react";

export const useForm = <T>(
  initialValues: T
): [T, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [values, setValues] = useState<T>(initialValues);

  return [
    values,
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
  ];
};
