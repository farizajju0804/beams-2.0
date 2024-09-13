import React, { useState, useEffect } from "react";

const DailyProgress: React.FC = () => {
  const [tasksCompleted, setTasksCompleted] = useState<number>(0);
  const [animationProgress, setAnimationProgress] = useState<number>(0);

  // Define colors for each task segment
  const colors: string[] = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#00FF00"];

  useEffect(() => {
    // Animate the progress over 1 second
    const duration = 1000;
    const start = Date.now();
    const animate = () => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [tasksCompleted]);

  const handleTaskCompletion = () => {
    if (tasksCompleted < 5) {
      setTasksCompleted(tasksCompleted + 1);
      setAnimationProgress(0);
    }
  };

  const renderPieSlice = (
    startAngle: number,
    endAngle: number,
    color: string,
    index: number
  ) => {
    const radius = 45;
    const cx = 50;
    const cy = 50;

    const start = polarToCartesian(cx, cy, radius, startAngle);
    const end = polarToCartesian(cx, cy, radius, endAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      "M", cx, cy,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
      "Z"
    ].join(" ");

    const isActiveSegment = index === tasksCompleted - 1;
    const clipPathId = `clipPath-${index}`;
    const maskId = `mask-${index}`;

    return (
      <g key={index}>
        <defs>
          <clipPath id={clipPathId}>
            <path d={d} />
          </clipPath>
          <mask id={maskId}>
            <circle 
              cx={cx} 
              cy={cy} 
              r={isActiveSegment ? radius * animationProgress : (index < tasksCompleted - 1 ? radius : 0)} 
              fill="white" 
            />
          </mask>
        </defs>
        <path
          d={d}
          fill={color}
          clipPath={`url(#${clipPathId})`}
          mask={`url(#${maskId})`}
        />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
      </g>
    );
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="200" height="200" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#D3D3D3" />
        {colors.map((color, index) => 
          renderPieSlice(index * 72, (index + 1) * 72, color, index)
        )}
      </svg>
      <button
        onClick={handleTaskCompletion}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          border: "none",
          borderRadius: "5px",
          color: "white",
          cursor: "pointer",
        }}
      >
        Complete Task
      </button>
    </div>
  );
};

export default DailyProgress;