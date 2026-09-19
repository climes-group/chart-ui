import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDebugMode,
  useOfflineMode,
  useSetDebugMode,
} from "./TestModeContext";

function DebugBanner() {
  const debugMode = useDebugMode();
  const offlineMode = useOfflineMode();
  const setDebugMode = useSetDebugMode();
  if (debugMode) {
    return (
      <div className="fixed bottom-0 z-[3] flex w-full justify-between gap-4 bg-black/35 p-2 text-sm text-white backdrop-blur">
        <div className="flex gap-4">
          <span className="">debug mode</span>
          <span>
            offline mode:{" "}
            <span
              className={
                offlineMode ? "font-black text-green-300" : "text-inherit"
              }
            >
              {offlineMode ? "on" : "off"}
            </span>
          </span>
          <span>
            build version: <span className="text-green-300">0.0.1</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          title="turn off debug mode"
          className="text-white hover:bg-white/10"
          onClick={() => setDebugMode(false)}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }
  return null;
}

export default DebugBanner;
