import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate(); // ✅ react-router hook

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path) => {
    setAnchorEl(null);
    if (path) navigate(path); // ✅ redirect if path providedz 
  };

  const menuItems = [
    { label: "CAQM Pledge", path: "/" },
    { label: "CAQM Poster", path: "/poster" },
    { label: "CAQM MUN", path: "/mun" },
  ];

  return (
    <AppBar
      position="fixed"
      style={{ background: "white", boxShadow: "none" }}
    >
      <Toolbar style={{ justifyContent: "center" }}>
        <Box display="flex">
          <Button
            onClick={handleClick}
            endIcon={
              <ArrowDropDownIcon sx={{ fontSize: "14px", marginLeft: "0px" }} />
            }
            sx={{
              color: "#4b2e00",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "13px",
              padding: "6px 6px",
              margin: "0 2px",
              "& .MuiButton-endIcon": {
                marginLeft: "0px",
              },
            }}
          >
            Programmes
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleClose(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => handleClose(item.path)} // ✅ navigate on click
                style={{
                  fontSize: "12px",
                  fontWeight: "600", // ✅ added font weight
                  minWidth: "160px",
                  color: "#333",
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
