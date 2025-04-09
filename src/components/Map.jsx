import { useEffect, useState } from "react";
import { Container, Sprite } from "@pixi/react";
import Grid from "./Grid";
import config from "../config";
import { useEncounterContext } from "../encounter-context";

const Map = ({ mapId }) => {
    const [map, setMap] = useState(null);
    const [imageSize, setImageSize] = useState(null);
    const { setMapLoaded } = useEncounterContext();

    useEffect(() => {

        const fetchMap = async () => {
            try {

                const response = await fetch(`http://127.0.0.1:3000/map/get?id=${mapId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch map");
                }

                const data = await response.json();
                console.log("Found map:", data);
                setMap(data);

                if (data.backgroundImage) {
                    const img = new window.Image();
                    img.src = data.backgroundImage;
                    img.onload = () => {
                        setImageSize({ width: img.width, height: img.height });
                        setMapLoaded(true);
                    };


                }
            } catch (error) {
                console.error("Error fetching map:", error);
            }
        };

        if (mapId) {
            fetchMap();
        }
    }, [mapId]);

    if (!map || !imageSize) {
        return null; // Prevent rendering until we have both the map and image size
    } else {
        config.mapState.tileSize = imageSize.width / map.width;
    }

    return (
        <Container>
            <Sprite image={map.backgroundImage} anchor={0.5} />
            {config.mapState.showGrid && <Grid lineColor={0xffffff} lineAlpha={0.5} width={imageSize.width} height={imageSize.height} />}
        </Container>
    );
};

export default Map;
