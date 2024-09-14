import React from 'react';
import LevelProgress from './LevelProgress';
import ScoreDisplay from './ScoreDisplay';
import ActivityPieChart from './ActivityPieChart';

const LevelAndScoreWithPie: React.FC = () => {
    const pieChartData = [
        { name: 'Beams Today', value: 500, color: '#FFC107' },
        { name: 'Poll', value: 300, color: '#FF5722' },
        { name: 'Share', value: 200, color: '#673AB7' },
    ];

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <LevelProgress level={1} progress={1000} total={2000} score={1000} />
                <ScoreDisplay score={1000} />
            </div>
            <ActivityPieChart data={pieChartData} />
        </div>
    );
};

export default LevelAndScoreWithPie;
