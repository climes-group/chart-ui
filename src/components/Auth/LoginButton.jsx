import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRef, useState } from "react";
import { LOGIN_PROVIDERS } from "./providers";

function LoginButton({ onIdToken }) {
  const { t } = useTranslation();
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSuccess = (idToken) => {
    onIdToken?.(idToken);
    handleClose();
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        ref={buttonRef}
        id="login-menu-button"
        variant="primary"
        size="default"
        onClick={handleOpen}
        aria-haspopup="true"
        aria-controls={open ? "login-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
      >
        {t("auth.login")}
      </Button>
      <Menu
        id="login-menu"
        anchorEl={buttonRef.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "login-menu-button",
          "aria-label": t("auth.chooseProvider"),
        }}
      >
        {LOGIN_PROVIDERS.map(({ id, name, Component }) => (
          <MenuItem
            key={id}
            disableRipple
            aria-label={t("auth.signInWith", { provider: name })}
          >
            <Component
              onSuccess={handleSuccess}
              onError={(err) => console.log(`${name} login failed`, err)}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default LoginButton;
