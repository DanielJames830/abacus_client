import { useCallback } from "react";
import { Graphics } from "@pixi/react";
import * as PIXI from 'pixi.js';
import config from "../config";

const Grid = ({ width, height, lineColor = 0xffffff, lineAlpha = 0.5, lineWidth = 2 }) => {

    const draw = useCallback((g) => {
        g.clear();

        g.lineStyle(lineWidth, lineColor, lineAlpha);

        for (let x = (-width / 2); x < width / 2; x += config.mapState.tileSize) {
            g.moveTo(x, -height / 2);
            g.lineTo(x, height / 2);
        }

        for (let y = (-height / 2); y <= height / 2; y += config.mapState.tileSize) {
            g.moveTo(-width / 2, y);
            g.lineTo(width / 2, y);
        }
    }, [width, height, config.mapState.tileSize, lineColor, lineAlpha, lineWidth]);

    return <Graphics draw={draw} />;
}

export default Grid;