import { useRef, useEffect, useState } from "react";
import { Stage, Container, Sprite } from "@pixi/react";
import '@pixi/events';
import Token from "./Token";
import { useEncounterContext } from "../encounter-context";
import config from "../config";
import Map from "./Map";

const EncounterViewport = ({ }) => {
    const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const [encounter, setEncounter] = useState(null);

    const [entities, setEntities] = useState([]);

    const { controllerState, setControllerState, mapLoaded } = useEncounterContext();

    const onWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        const newZoom = Math.max(
            0.1,
            Math.min(config.mapState.currentZoom + (e.deltaY > 0 ? -zoomFactor : zoomFactor), 5)
        );

        const cursorPosition = { x: e.offsetX, y: e.offsetY };
        const worldPosition = {
            x: (cursorPosition.x - position.x) / config.mapState.currentZoom,
            y: (cursorPosition.y - position.y) / config.mapState.currentZoom,
        };

        setPosition({
            x: cursorPosition.x - worldPosition.x * newZoom,
            y: cursorPosition.y - worldPosition.y * newZoom,
        });

        config.mapState.currentZoom = newZoom;
    };

    useEffect(() => {
        const container = document.querySelector("canvas");
        container.addEventListener("wheel", onWheel);

        return () => {
            container.removeEventListener("wheel", onWheel);
        };
    }, [position]);

    const onPointerDown = (e) => {
        if (!controllerState.isMoving) {

            setDragging(true);
            dragStart.current = { x: e.global.x - position.x, y: e.global.y - position.y };
        }
    };

    const onPointerMove = (e) => {
        if (!controllerState.isMoving && dragging) {
            setControllerState(prev => ({ ...prev, selectedEntity: null }));
            setPosition({
                x: e.global.x - dragStart.current.x,
                y: e.global.y - dragStart.current.y,
            });
        }
    };

    const onPointerUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        const fetchEncounter = async () => {
            try {
                const response = await fetch('http://127.0.0.1:3000/encounter/get?id=5cc300f2-d30a-4e93-93c2-ea4afad98ca3', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch encounter');
                }

                const data = await response.json();
                console.log("Found encounter:", data);
                setEncounter(data);
                setEntities(data.entities);
            } catch (error) {
                console.error('Error fetching encounter:', error);
            }
        };

        fetchEncounter();
    }, []);




    return (
        <Container
            scale={config.mapState.currentZoom}
            position={[position.x, position.y]}
            interactive
            pointerdown={onPointerDown}
            onglobalpointermove={onPointerMove}
            pointerup={onPointerUp}
            pointerupoutside={onPointerUp}
        >
            {encounter && <Map mapId={encounter.mapId} anchor={0} />}

            {mapLoaded && entities.map((obj, index) => (
                <Token key={index} entity={obj} />
            ))}
        </Container>
    );
};

export default EncounterViewport;
