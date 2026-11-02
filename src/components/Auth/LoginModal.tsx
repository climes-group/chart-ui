import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { setLoginModalOpen } from "@/state/slices/userReducer";
import { RootState } from "@/state/store";
import Modal from "@mui/material/Modal";
import { XIcon } from "lucide-react";
import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";

function LoginModal({ children }: Readonly<{ children: React.ReactNode }>) {
  const { t } = useTranslation();
  const isModalOpen = useSelector(
    (state: RootState) => state.user.loginModalOpen,
  );
  const titleId = useId();
  const descriptionId = useId();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setLoginModalOpen(false));
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="flex h-screen items-center justify-center"
      >
        <div className="bg-surface relative rounded p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between">
            <h2 id={titleId} className="mb-0">
              {t("auth.login")}
            </h2>
            <Button
              aria-label={t("auth.closeLogin")}
              variant="ghost"
              onClick={handleClose}
            >
              <XIcon />
            </Button>
          </div>
          <p id={descriptionId}>{t("auth.chooseProvider")}</p>
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default LoginModal;
