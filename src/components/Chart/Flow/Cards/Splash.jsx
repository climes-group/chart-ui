import OidcLogin from "@/components/Auth/OidcLogin";
import { Button } from "@/components/ui/button";
import { dismissSplash, setTheme } from "@/state/slices/flowReducer";
import { Fab } from "@mui/material";
import { NavigationIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SplashCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.flow.theme);

  const handleDismiss = () => {
    dispatch(dismissSplash());
    navigate("/flow/intake");
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center py-8 gap-4">
      <div className="flex justify-between gap-2 top-2 left-2 right-2 absolute">
        <div className="flex gap-2">
          <Button
            variant={theme === 1 ? "" : "primary"}
            onClick={() => dispatch(setTheme(1))}
          >
            1
          </Button>
          <Button
            variant={theme === 2 ? "" : "primary"}
            onClick={() => dispatch(setTheme(2))}
          >
            2
          </Button>
        </div>
        <OidcLogin />
      </div>
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
            color: "#fff",
          }}
        >
          <NavigationIcon />
          Get Started
        </Fab>
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-slate-700">
        Copyright blurb 2025
      </div>
    </section>
  );
}
