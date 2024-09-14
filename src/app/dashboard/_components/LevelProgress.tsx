import React from 'react';

interface LevelProgressProps {
    level: number;
    progress: number;
    total: number;
    score: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ level, progress, total, score }) => (
    <div>
        <div className="text-lg font-semibold">Level - {level}</div>
        <div>{progress}/{total}</div>
        <div className="bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-brand" style={{ width: `${(progress / total) * 100}%`, height: '10px' }} />
        </div>
        <div className="text-6xl font-bold text-brand">{score}</div>
    </div>
);

export default LevelProgress;
