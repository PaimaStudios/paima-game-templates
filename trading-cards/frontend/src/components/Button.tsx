import * as React from "react";

import type { ButtonProps as BaseButtonProps } from "@mui/material";
import { Button as BaseButton, Typography } from "@mui/material";

interface ButtonProps extends BaseButtonProps {
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <BaseButton variant="contained" color="primary" {...props}>
      <Typography variant={props.variant !== "text" ? "button" : "body1"}>
        {children}
      </Typography>
    </BaseButton>
  );
};

export default Button;
