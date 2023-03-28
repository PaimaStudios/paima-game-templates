import * as React from "react";
import logo from "@assets/images/chess_logo.png";
import "./Logo.scss";
import clsx from "clsx";

interface LogoProps {
  mainMenu?: boolean;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width, height, mainMenu = false }) => {
  return (
    <img
      className={clsx("chess-logo", mainMenu && "chess-logo--main")}
      src={logo}
      alt="Paima Chess"
      width={width}
      height={height}
    />
  );
};

export default Logo;
