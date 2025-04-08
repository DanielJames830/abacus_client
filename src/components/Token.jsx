import { Sprite, Container, Text } from '@pixi/react';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { useState, useRef } from 'react';
import '@pixi/events';
import config from "../config";
import { useEncounterContext } from '../encounter-context';

const Token = ({ entity }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const { controllerState, setControllerState } = useEncounterContext();

    const onPointerDown = (e) => {
        setControllerState(prev => ({ ...prev, selectedEntity: entity }));

        if (!config.mapState.isMoving) {
            config.mapState.isMoving = true;
            dragging.current = true;

            const zoom = config.mapState.currentZoom || 1;

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
            setPosition(prev => ({
                x: Math.round(prev.x / config.mapState.tileSize) * config.mapState.tileSize,
                y: Math.round(prev.y / config.mapState.tileSize) * config.mapState.tileSize,
            }));
        }
    };

    const isSelected = controllerState.selectedEntity?.id === entity.id;

    return (
        <Container>
            <Sprite
                image={entity.image}
                x={position.x}
                y={position.y - (isSelected ? 5 : 0)}
                height={config.mapState.tileSize}
                width={config.mapState.tileSize}
                interactive
                cursor={!isSelected ? "pointer" : config.mapState.isMoving ? "grabbing" : "default"}
                pointerdown={onPointerDown}
                onglobalpointermove={onPointerMove}
                pointerup={onPointerUp}
                pointerupoutside={onPointerUp}
                anchor={1}
                filters={isSelected ? [
                    new DropShadowFilter({
                        color: 0x000000,
                        alpha: 0.8,
                        blur: 0,
                        distance: 20,
                        offset: { x: 0, y: 5 }
                    }),
                ] : []}
            />
        </Container>
    );
};

export default Token;
