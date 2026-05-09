import { useTranslation } from "@/i18n";
import type { RootState } from "@/state/store";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, type MouseEvent } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = { logout?: () => void };

function AccountControls({ logout }: Props) {
  const profile = useSelector((state: RootState) => state.user.profile);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
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
            title={t("auth.loggedInAs", { email: String(profile.email ?? "") })}
            variant="text"
            color="primary"
          >
            {String(profile.given_name ?? "")}
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
            <MenuItem
              onClick={() => {
                navigate("/reports");
                handleClose();
              }}
            >
              {t("auth.savedReports")}
            </MenuItem>
            <MenuItem onClick={logout}>{t("auth.logout")}</MenuItem>
          </Menu>
        </>
      ) : null}
    </div>
  );
}
export default AccountControls;
