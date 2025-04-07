import { Graphics, Sprite } from '@pixi/react';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { useState, useRef, use, useMemo } from 'react';
import '@pixi/events';
import config from "../config";

const Token = ({ entity, id }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const isSelected = useMemo(() => {
        return id === config.controlState.selectedToken;
    }, [id, config.controlState.selectedToken]);

    const onPointerDown = (e) => {
        if (!config.mapState.isMoving) {
            config.mapState.isMoving = true;
            dragging.current = true;
            config.controlState.selectedToken = id;
            const zoom = config.mapState.currentZoom || 1;
            // Convert global pointer coordinates to local coordinates
            dragStart.current = {
                x: (e.global.x / zoom) - position.x,
                y: (e.global.y / zoom) - position.y,
            };
        }
    };

    const onPointerMove = (e) => {
        if (dragging.current) {
            const zoom = config.mapState.currentZoom || 1;

            setPosition({
                x: (e.global.x / zoom) - dragStart.current.x,
                y: (e.global.y / zoom) - dragStart.current.y,
            });
        }
    };

    const onPointerUp = () => {
        config.mapState.isMoving = false;
        dragging.current = false;

        if (config.mapState.snapToGrid) {
            setPosition({
                x: Math.round(position.x / config.mapState.tileSize) * config.mapState.tileSize,
                y: Math.round(position.y / config.mapState.tileSize) * config.mapState.tileSize,
            });
        }
    };

    return (
        <Sprite
            image={entity.image}
            x={position.x}
            y={position.y - (isSelected ? 5 : 0)}
            height={config.mapState.tileSize}
            width={config.mapState.tileSize}
            interactive
            cursor="pointer"
            pointerdown={onPointerDown}
            onglobalpointermove={onPointerMove}
            pointerup={onPointerUp}
            pointerupoutside={onPointerUp}
            anchor={1}
            filters={[
                new DropShadowFilter({
                    color: 0x000000,
                    alpha: 0.8,
                    blur: 0,
                    distance: 20,
                    offset: { x: 0, y: 5 }
                }),
            ]}
        />
    );
};

export default Token;
