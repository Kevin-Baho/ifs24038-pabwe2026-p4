import { useState } from "react";

export function useInput(defaultValue = "") {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  return [value, handleValueChange, setValue];
}

export default useInput;

