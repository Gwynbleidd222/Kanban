import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'

const ColumnsContext = createContext();

export function useColumns() {
    return useContext(ColumnsContext);
}

export function ColumnsProvider({ children }) {
    const [columns, setColumns] = useState([{ id: uuidv4(), name: '' }]);

    const updateColumns = (newColumns) => {
        setColumns(newColumns);
    };

    return (
        <ColumnsContext.Provider value={{ columns, updateColumns }}>
            {children}
        </ColumnsContext.Provider>
    );
}