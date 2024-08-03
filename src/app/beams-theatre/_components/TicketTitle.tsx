import React from 'react';

interface TicketTitleProps {
  title: string;
}

const TicketTitle: React.FC<TicketTitleProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-6 h-10 bg-black border-r border-dotted border-white">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-10 clip-path-top"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-10 clip-path-bottom"></div>
      </div>

      <div className="w-fit flex items-center text-xl md:text-2xl font-display justify-center p-4 h-10 bg-black text-white">
        {title}
      </div>

      <div className="relative w-6 h-10 bg-black border-l border-dotted border-white">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-10 clip-path-top"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-10 clip-path-bottom"></div>
      </div>
    </div>
  );
};

export default TicketTitle;
