interface ProgressBarProps {
    currentSlide: number;
    totalSlides: number;
  }
  
  const ProgressBar: React.FC<ProgressBarProps> = ({ currentSlide, totalSlides }) => {
    return (
      <div className="w-full flex flex-col items-center justify-center mb-4">
        <div className="flex space-x-3 md:space-x-6 lg:space-x-8 mb-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 md:w-14 rounded-full ${
                index < currentSlide ? "bg-brand" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-grey-2">{currentSlide} of {totalSlides}</p>
      </div>
    );
  };
  
  export default ProgressBar;
  