import React from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { Button } from '@nextui-org/react';

interface PaginationProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  completeBtnText: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onComplete,
  completeBtnText,
}) => {
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <div className="flex justify-center items-center space-x-8 mb-6">
      <Button
      size='sm'
      isIconOnly
        onClick={onPrev}
        disabled={isFirstSlide}
        className={`w-fit rounded-full transition-all duration-300 ${
          isFirstSlide ? 'bg-grey-1' : 'bg-[#d2d2d2]'
        }`}
        // aria-label="Previous slide"
      >
        <ArrowLeft2 size="16" color={isFirstSlide ? '#9CA3AF' : '#181818'} />
      </Button>
      
      {isLastSlide ? (
        <Button
        
          onClick={onComplete}
          className="px-6 py-2 bg-brand text-lg text-white  font-medium"
        >
          {completeBtnText}
        </Button>
      ) : (
        <Button
        isIconOnly
        size='sm'
          onClick={onNext}
          className="w-fit rounded-full bg-[#d2d2d2]"
          aria-label="Next slide"
        >
          <ArrowRight2 size="16" color="#181818" />
        </Button>
      )}
    </div>
  );
};

export default Pagination;