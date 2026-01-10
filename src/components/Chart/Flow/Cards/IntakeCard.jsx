import useFlow from "@/hooks/useFlow";
import NavigationOutlined from "@mui/icons-material/NavigationOutlined";
import { Fab } from "@mui/material";

export default function IntakeCard(props) {
  const { next } = useFlow();
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-opacity-90 py-8">
      <div className="max-w-lg w-full bg-white bg-opacity-90 rounded-xl shadow-lg p-8 flex flex-col items-center text-center mx-4">
        <h1 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
          Welcome to <i>CHART</i>
        </h1>
        <p className="mb-8 text-gray-800 text-base md:text-lg font-light">
          Your journey to climate lorem ipsum starts here. This is a brief
          introduction to the CHART platform.
        </p>
        <Fab
          variant="extended"
          onClick={next}
          className="!bg-green-600 hover:!bg-green-700 text-white px-8 py-2 text-lg font-semibold shadow-md transition-colors duration-200"
          sx={{ borderRadius: "9999px", minWidth: "180px" }}
        >
          <NavigationOutlined sx={{ mr: 1 }} />
          Get Started
        </Fab>
      </div>
    </section>
  );
}
