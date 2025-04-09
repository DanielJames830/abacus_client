import { Stage, Sprite } from "@pixi/react";
import EncounterViewport from "./components/EncounterViewport";
import { useCallback, useEffect, useState } from "react";
import config from "./config";
import tokenImage from "./assets/cleric.png"
import { v4 as uuidv4 } from 'uuid';
import { EncounterProvider } from "./encounter-context";

function App() {
  const calculateCanvasSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return { width, height };
  };

  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize);

  const [showGrid, setShowGrid] = useState(config.mapState.showGrid);

  const toggleGrid = () => {
    setShowGrid(prevShowGrid => {
      config.mapState.showGrid = !prevShowGrid;
      return !prevShowGrid;
    });


  };

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  return (
    <div>
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <button onClick={() => toggleGrid()} style={{ margin: "0 5px" }}>{config.mapState.showGrid ? "Hide Grid" : "Show Grid"}</button>
      </div>
      <Stage width={canvasSize.width} height={canvasSize.height} options={{
        backgroundColor:
          "#03191E"
      }}>
        <EncounterProvider >
          <EncounterViewport />
        </EncounterProvider>
      </Stage>
    </div>
  );
}

export default App;
