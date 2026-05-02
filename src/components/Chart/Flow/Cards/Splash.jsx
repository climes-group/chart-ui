import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SplashCard() {
  const navigate = useNavigate();

  const handleDismiss = () => {
    navigate("/flow/intake");
  };

  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col py-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-teal-deep text-5xl leading-none font-bold tracking-[0.15em] sm:text-6xl md:text-7xl lg:text-8xl">
          CHART
        </h1>
        <p className="text-teal-deep/75 mt-3 max-w-sm text-sm sm:text-base">
          Charting your path to resilience
        </p>
        <Button onClick={handleDismiss} size="lg" className="mt-8 px-8">
          Get started
          <ArrowRight />
        </Button>
      </div>
      <footer className="text-charcoal/50 text-center text-xs">
        © 2026 Climes Group Engineering Inc.
      </footer>
    </section>
  );
}
