import useFlow from "@/hooks/useFlow";
import { Fab } from "@mui/material";
import { NavigationIcon } from "lucide-react";

export default function IntakeCard(props) {
  const { next } = useFlow();
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-opacity-90 py-8">
      <div className="max-w-lg w-full p-8 flex flex-col items-center text-center mx-4">
        <h1 className="mb-4 text-3xl md:text-4xl text-charcoal">
          <span className="text-charcoal font-medium text-4xl tracking-tight">
            Welcome to
          </span>
          <div className="tracking-wide font-extrabold text-6xl leading-[1.1]">
            CHART
          </div>
        </h1>
        <p className="mb-8 text-gray-800 text-base md:text-lg font-light">
          Your journey to climate lorem ipsum starts here. This is a brief
          introduction to the CHART platform.
        </p>
        <Fab
          color="secondary"
          onClick={next}
          className="text-white px-8 py-2 text-lg font-semibold shadow-md transition-colors duration-200"
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
