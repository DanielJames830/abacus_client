import { Sprite, Container, Graphics } from '@pixi/react';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import React, { useState, useRef, useEffect } from 'react';
import '@pixi/events';
import config from "../config";
import { useEncounterContext } from '../encounter-context';


const Token = ({ entity }) => {
    const [position, setPosition] = useState({ x: entity.x * config.mapState.tileSize, y: entity.y * config.mapState.tileSize });
    const dragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const { controllerState, setControllerState } = useEncounterContext();
    const [isLoaded, setIsLoaded] = useState(false);

    const onPointerDown = (e) => {

        setControllerState(prev => {
            console.log("Setting selected entity:", entity);
            console.log("Previous state:", prev);
            console.log("New state:", { ...prev, selectedEntity: entity });
            return ({ ...prev, selectedEntity: entity });
        });


        if (!controllerState.isMoving) {
            setControllerState(prev => ({ ...prev, isMoving: true }));
            dragging.current = true;

            const zoom = config.mapState.currentZoom || 1;

            dragStart.current = {
                x: (e.global.x / zoom) - position.x,
                y: (e.global.y / zoom) - position.y,
            };
        }
    };

    const onPointerMove = (e) => {

        if (controllerState.isMoving && dragging.current) {
            const zoom = config.mapState.currentZoom || 1;

            setPosition({
                x: (e.global.x / zoom) - dragStart.current.x,
                y: (e.global.y / zoom) - dragStart.current.y,
            });
        };
    }

    const onPointerUp = () => {

        setControllerState(prev => ({ ...prev, isMoving: false }));
        dragging.current = false;

        if (config.mapState.snapToGrid) {
            setPosition(prev => ({
                x: Math.round(prev.x / config.mapState.tileSize) * config.mapState.tileSize,
                y: Math.round(prev.y / config.mapState.tileSize) * config.mapState.tileSize,
            }));
        }
    };

    useEffect(() => {
        setIsLoaded(true);
    })


    const isSelected = controllerState.selectedEntity?.id === entity.id;
    const maskRef = useRef();
    return (
        <Container filters={isSelected ? [
            new DropShadowFilter({
                color: 0x000000,
                alpha: 0.8,
                blur: 0,
                distance: 20,
                offset: { x: 0, y: 5 }
            }),] : []}
            x={position.x}
            y={position.y - (isSelected ? 5 : 0)}
            interactive
            cursor={!isSelected ? "pointer" : controllerState.isMoving ? "grabbing" : "grab"}
            pointerdown={onPointerDown}
            onglobalpointermove={onPointerMove}
            pointerup={onPointerUp}
            pointerupoutside={onPointerUp}
            height={config.mapState.tileSize}
            width={config.mapState.tileSize}>



            <Graphics
                name={"mask"}
                preventRedraw={true}
                draw={(g) => {
                    g.clear();
                    g.beginFill(0x000000, 0.5);
                    g.drawCircle(config.mapState.tileSize / 2,
                        config.mapState.tileSize / 2,
                        (config.mapState.tileSize / 2) * 0.9);
                    g.endFill();
                }}
                ref={maskRef}
            />

            <Graphics
                name={"frame"}
                preventRedraw={true}
                draw={(g) => {
                    g.clear();
                    g.beginFill((isSelected ? 0xDF0000 : 0xe1e1e1), 1);
                    g.drawCircle(config.mapState.tileSize / 2, config.mapState.tileSize / 2, config.mapState.tileSize / 2);
                    g.endFill();
                }}

            />

            <Sprite
                mask={maskRef.current}
                image={entity.image}

                height={config.mapState.tileSize * 0.9}
                width={config.mapState.tileSize * 0.9}

                anchor={-0.06}

            />

        </Container >
    );
};

export default Token;
