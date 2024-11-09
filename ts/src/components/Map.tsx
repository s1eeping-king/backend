import React from 'react';
import Man from '../src/ast/Man.js';
import Path from '../src/ast/Path.js';
import Wall from '../src/ast/Wall.js';
import Trap from '../src/ast/Trap.js';
import Chest from '../src/ast/Chest.js';
import Treasure from '../src/ast/Treasure.js';

interface MapProps {
    mapData: number[][];
    playerPosition: { x: number; y: number };
}

const Map: React.FC<MapProps> = ({ mapData, playerPosition }) => {
    return (
        <div className="map">
            {mapData.map((row, rowIndex) => (
                <div key={rowIndex} className="map-row">
                    {row.map((cell, colIndex) => {
                        const isPlayerHere =
                            playerPosition.x === rowIndex && playerPosition.y === colIndex;

                        return (
                            <span
                                key={colIndex}
                                className={`map-cell ${isPlayerHere ? "player" : ""}`}
                            >
                                {isPlayerHere ? (
                                    <Man />
                                ) : (
                                    cell === 1 ? <Wall /> :
                                        cell === 2 ? <Trap /> :
                                            cell === 3 ? <Chest /> :
                                                cell === 4 ? <Treasure /> :
                                                    <Path />
                                )}
                            </span>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Map;
