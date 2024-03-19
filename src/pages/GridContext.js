import React, { createContext, useContext, useState } from 'react';

const GridContext = createContext();

export const useGrid = () => useContext(GridContext);

export const GridProvider = ({ children }) => {
    const [gridSize, setGridSize] = useState({ rows: 20, cols: 20 });

    return (
        <GridContext.Provider value={{ gridSize, setGridSize }}>
            {children}
        </GridContext.Provider>
    );
};
