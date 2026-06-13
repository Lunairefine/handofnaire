'use client';
import React from 'react';
import { useAppContext } from './AppContext';

export default function TopoBackground() {
  const { theme } = useAppContext();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        {/* Dark Theme Background */}
        <div 
            className={`absolute inset-0 transition-opacity duration-500 bg-cover bg-center ${theme === 'dark' ? 'opacity-60' : 'opacity-0'}`}
            style={{ backgroundImage: `url("/theme/topo-dark.svg")` }}
        />

        {/* Light Theme Background */}
        <div 
            className={`absolute inset-0 transition-opacity duration-500 bg-cover bg-center ${theme === 'light' ? 'opacity-60' : 'opacity-0'}`}
            style={{ backgroundImage: `url("/theme/topo-light.svg")` }}
        />
    </div>
  );
}
