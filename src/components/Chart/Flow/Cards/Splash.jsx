import { dismissSplash } from "@/state/slices/flowReducer";
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
    <section className="flex min-h-[90vh] items-center justify-center gap-4 py-8">
      <div className="absolute top-2 right-2 left-2 flex justify-between gap-2"></div>
      <div className="mx-4 flex w-full max-w-lg flex-col items-center p-8 text-center">
        <h1 className="text-foreground mb-2 text-xl font-medium tracking-tight md:text-2xl">
          Welcome to
        </h1>
        <p className="text-foreground mb-4 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
          CHART
        </p>
        <p className="body-muted mb-8 max-w-sm text-center">
          Climate resilience lorem ipsum
        </p>
        <Fab
          color="secondary"
          onClick={handleDismiss}
          className="px-8 py-2 text-base font-semibold text-white shadow-md transition-colors duration-200"
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
      <div className="absolute right-2 bottom-2 text-xs text-slate-700">
        Copyright blurb 2025
      </div>
    </section>
  );
}
