import React from "react";
import logo from "@assets/images/favicon.png";
import "./Logo.scss";
import clsx from "clsx";

interface LogoProps {
  mainMenu?: boolean;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ height, mainMenu = false }) => {
  return (
    <img
      className={clsx("chess-logo", mainMenu && "chess-logo--main")}
      src={logo}
      alt="Paima Chess"
      height={height}
    />
  );
};

export default Logo;
