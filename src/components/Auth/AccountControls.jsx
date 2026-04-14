import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AccountControls({ logout }) {
  const profile = useSelector((state) => state.user.profile);

  const navigate = useNavigate();
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
            <MenuItem onClick={() => { navigate("/reports"); handleClose(); }}>Saved Reports</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </>
      ) : null}
    </div>
  );
}
export default AccountControls;
