import React from "react";

import type { BaseTextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";

interface NumericFieldProps extends BaseTextFieldProps {
  onChange: (value: string) => void;
}

const NumericField: React.FC<NumericFieldProps> = ({ onChange, ...props }) => {
  return (
    <TextField
      type="number"
      variant="outlined"
      onChange={(event) => onChange(event.target.value)}
      {...props}
    />
  );
};

export default NumericField;
