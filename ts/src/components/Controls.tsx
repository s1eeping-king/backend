// src/components/Controls.tsx

import React, { useEffect } from 'react';

interface ControlsProps {
    onMove: (direction: string) => void;
    onStart: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onMove, onStart }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    onMove('up');
                    break;
                case 'ArrowDown':
                    onMove('down');
                    break;
                case 'ArrowLeft':
                    onMove('left');
                    break;
                case 'ArrowRight':
                    onMove('right');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onMove]);

    return (
        <div>
            <button className="start-button" onClick={onStart}>Game Start</button>
        </div>
    );
};

export default Controls;
