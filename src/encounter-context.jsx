import React, { createContext, useContext, useState } from 'react';

const EncounterContext = createContext();

export const EncounterProvider = ({ children }) => {
    const [controllerState, setControllerState] = useState({
        selectedEntity: null,
    });

    const [currentZoom, setCurrentZoom] = useState(1);
    const [isMoving, setIsMoving] = useState(false);

    const [mapState, setMapState] = useState({

        tileSize: 0,
        showGrid: true,
        snapToGrid: true,
    })

    return (
        <EncounterContext.Provider value={{ controllerState, setControllerState, mapState, setMapState, currentZoom, setCurrentZoom, isMoving, setIsMoving }}>
            {children}
        </EncounterContext.Provider>
    );
}

export const useEncounterContext = () => {
    const context = useContext(EncounterContext);
    if (!context) {
        throw new Error("useEncounterContext must be used within an EncounterProvider");
    }
    return context;
}

