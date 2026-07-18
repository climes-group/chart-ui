import { setLoginModalOpen } from "@/state/slices/userReducer";
import { RootState } from "@/state/store";
import { IconButton } from "@mui/material";
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
        <div className="relative rounded bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="mb-0 text-xl font-bold">Login</h2>
            <IconButton aria-label="close" onClick={handleClose}>
              <XIcon />
            </IconButton>
          </div>
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default LoginModal;
