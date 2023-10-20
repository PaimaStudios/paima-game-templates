import * as React from "react";

import { Typography } from "@mui/material";
import { LoadingButton as BaseButton, LoadingButtonProps } from "@mui/lab";

interface ButtonProps extends LoadingButtonProps {
  children?: React.ReactNode;
}

const LoadingButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    const content = props.loading ? children : (
        <Typography variant={props.variant !== "text" ? "button" : "body1"}>
            {children}
        </Typography>
    );
    return (
    <BaseButton variant="contained" color="primary" {...props}>
        {content}
    </BaseButton>
    );
};

export default LoadingButton;
