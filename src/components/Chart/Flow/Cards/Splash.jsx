import { dismissSplash } from "@/state/slices/flowReducer";
import { Fab } from "@mui/material";
import { NavigationIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SplashCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDismiss = () => {
    dispatch(dismissSplash());
    navigate("/flow/intake");
  };

  return (
    <section className="min-h-[60vh] flex items-center justify-center py-8">
      <div className="max-w-lg w-full p-8 flex flex-col items-center text-center mx-4">
        <h1 className="text-foreground mb-2 text-xl md:text-2xl font-medium tracking-tight">
          Welcome to
        </h1>
        <p className="text-foreground text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          CHART
        </p>
        <p className="body-muted mb-8 text-center max-w-sm">
          Climate resilience lorem ipsum
        </p>
        <Fab
          color="secondary"
          onClick={handleDismiss}
          className="text-white px-8 py-2 text-base font-semibold shadow-md transition-colors duration-200"
          sx={{
            borderRadius: "9999px",
            minWidth: "180px",
            gap: "8px",
          }}
        >
          <NavigationIcon />
          Get Started
        </Fab>
      </div>
    </section>
  );
}
