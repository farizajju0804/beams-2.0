"use client"
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface ActivityData {
    name: string;
    value: number;
    color: string;
}

interface ActivityPieChartProps {
    data: ActivityData[];
}

const ActivityPieChart: React.FC<ActivityPieChartProps> = ({ data }) => (
    <PieChart width={150} height={150}>
        <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
        >
            {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
        </Pie>
    </PieChart>
);

export default ActivityPieChart;
