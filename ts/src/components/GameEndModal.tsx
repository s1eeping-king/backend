// src/components/GameEndModal.tsx

import React from 'react';

interface GameEndModalProps {
    score: number;
    onRestart: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({ score, onRestart }) => {
    return (
        <div className="game-end-modal">
            <h2>Game Over</h2>
            <p>Your Score: {score}</p>
            <button onClick={onRestart} className="restart-button">
                Restart Game
            </button>
        </div>
    );
};

export default GameEndModal;
