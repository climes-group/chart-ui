import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useSelector } from "react-redux";

function AccountControls({ login, logout }) {
  const profile = useSelector((state) => state.user.profile);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="flex flex-col items-center justify-center">
      {profile ? (
        <>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            title={`Logged in as ${profile.email}`}
            variant="text"
            color="primary"
          >
            {profile?.given_name}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem disabled>My account (TBD)</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <button
          onClick={login}
          className="text-sm font-medium text-teal-deep border border-teal-deep/40 hover:bg-teal-deep/5 hover:border-teal-deep/70 transition-colors rounded-md px-3 py-1.5"
        >
          Login
        </button>
      )}
    </div>
  );
}
export default AccountControls;
