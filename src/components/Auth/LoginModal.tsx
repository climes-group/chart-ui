import { Button } from "@/components/ui/button";
import { setLoginModalOpen } from "@/state/slices/userReducer";
import { RootState } from "@/state/store";
import Modal from "@mui/material/Modal";
import { XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function LoginModal({ children }: Readonly<{ children: React.ReactNode }>) {
  const isModalOpen = useSelector(
    (state: RootState) => state.user.loginModalOpen,
  );

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setLoginModalOpen(false));
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <div className="flex h-screen items-center justify-center">
        <div className="bg-surface relative rounded p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="mb-0">Login</h2>
            <Button aria-label="close" variant="ghost" onClick={handleClose}>
              <XIcon />
            </Button>
          </div>
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default LoginModal;
