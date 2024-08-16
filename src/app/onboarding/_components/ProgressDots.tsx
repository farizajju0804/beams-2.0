import React from 'react';

interface ProgressDotsProps {
  totalDots: number;
  activeDot: number;
  activeColor: string;
  inactiveColor: string;
  onDotClick: (index: number) => void;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({
  totalDots,
  activeDot,
  activeColor,
  inactiveColor,
  onDotClick,
}) => {
  return (
    <div className="flex items-center space-x-1 lg:space-x-2">
      {[...Array(totalDots)].map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-1 lg:w-2 rounded-full transition-all duration-300 ${
            index === activeDot ? 'h-4 lg:h-8' : 'h-1 lg:h-2'
          } cursor-pointer focus:outline-none`}
          style={{
            backgroundColor: index === activeDot ? activeColor : inactiveColor,
          }}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ProgressDots;