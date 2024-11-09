// src/components/PlayerStatus.tsx

import React from 'react';

interface PlayerStatusProps {
    health: number;
    coins: number;
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({ health, coins }) => {
    return (
        <div className="player-status">
            <div className="status-item">
                <div className="health-bar">
                    <div
                        className="health-bar-fill"
                        style={{ width: `${health}%` }}
                    ></div>
                </div>
                <span className="health-text">Health: {health}</span>
            </div>
            <div className="status-item">
                <span>Coins: {coins}</span>
            </div>
        </div>
    );
};

export default PlayerStatus;
