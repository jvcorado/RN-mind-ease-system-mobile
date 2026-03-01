import React, { createContext, useContext, ReactNode } from 'react';

interface FontContextType {
    scale: number;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider = ({ children, fontSize }: { children: ReactNode; fontSize: number }) => {
    const scale = fontSize / 100;

    return (
        <FontContext.Provider value={{ scale }}>
            {children}
        </FontContext.Provider>
    );
};

export const useFontScale = () => {
    const context = useContext(FontContext);
    if (!context) {
        throw new Error('useFontScale must be used within a FontProvider');
    }
    return context;
};
