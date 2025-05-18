import useFlow from "@/hooks/useFlow";
import NavigationOutlined from "@mui/icons-material/NavigationOutlined";
import { Fab } from "@mui/material";

export default function IntakeCard(props) {
  const { next } = useFlow();
  return (
    <section className="absolute top-0 bottom-0 left-0 right-0 bg-intake-bg bg-cover bg-center bg-no-repeat bg-opacity-90">
      <div className="p-8">
        <h1 className="my-8 text-white">
          Welcome to <i>CHART</i>
        </h1>
        <Fab variant="extended" onClick={next}>
          <NavigationOutlined sx={{ mr: 1 }} />
          Proceed
        </Fab>
      </div>
    </section>
  );
}
