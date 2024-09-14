interface ScoreDisplayProps {
    score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => (
    <div className="text-6xl font-bold text-orange-500">{score}</div>
);


export default ScoreDisplay;
