import { Container } from "@mui/material";
import clsx from "clsx";
import * as React from "react";
import "./Wrapper.scss";

interface WrapperProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  small?: boolean;
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
  className,
  small,
  ...props
}) => {
  return (
    <Container maxWidth={small ? "sm" : "xl"}>
      <div className={clsx("wrapper", className)} {...props}>
        {children}
      </div>
    </Container>
  );
};

export default Wrapper;
