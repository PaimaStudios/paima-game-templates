import React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

// TODO: use styled components across the app
// inspired by https://mui.com/material-ui/react-app-bar/#app-bar-with-search-field
const Search = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  flexFlow: "row",
  alignItems: "center",
  position: "relative",
  width: "527px",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flex: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

interface SearchAppBarProps {
  value: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchAppBarProps> = ({ value, onSearch }) => {
  return (
    <Search>
      <StyledInputBase
        value={value}
        // TODO: this searches in all values, AFAIK
        placeholder="Search lobby ID…"
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => onSearch(e.target.value)}
      />
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
    </Search>
  );
};

export default SearchBar;
