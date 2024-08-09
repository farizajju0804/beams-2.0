'use client';
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaQuoteRight, FaTimes, FaPause, FaPlay } from 'react-icons/fa';

type Testimonial = {
  name: string;
  title: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Danica W.',
    title: 'Founder of XYZ',
    quote: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa nostrum labore dolor.'
  },
  {
    name: 'Peter H.',
    title: 'Founder of XYZ',
    quote: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa nostrum labore dolor.'
  },
  {
    name: 'Claude O.',
    title: 'Founder of XYZ',
    quote: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa nostrum labore dolor.'
  },
  {
    name: 'Max Q.',
    title: 'Founder of XYZ',
    quote: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa nostrum labore dolor.'
  },
];

const TestimonialSection: React.FC = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    if (isPaused || isAnimationPaused) {
      controls.stop();
    } else {
      controls.start({
        x: '-100%',
        transition: { repeat: Infinity, duration: 50, ease: 'linear' }
      });
    }
  }, [isPaused, isAnimationPaused, controls]);

  const isMobile = window.innerWidth < 767;

  const openPopup = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsPaused(true);
  };

  const closePopup = () => {
    setSelectedTestimonial(null);
    setIsPaused(false);
  };

  const toggleAnimationPause = () => {
    setIsAnimationPaused(!isAnimationPaused);
  };

  return (
    <div className="bg-secondary-1 text-text rounded-3xl py-4 lg:py-8 px-6 relative overflow-hidden">
      <h2 className="text-xl lg:text-2xl font-bold font-poppins text-center mb-2 lg:mb-4">Testimonials</h2>
      <p className="text-center text-sm lg:text-base mb-8 text-grey-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus consequatur reprehenderit.</p>

      <button 
        onClick={toggleAnimationPause} 
        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md z-10"
      >
        {isAnimationPaused ? <FaPlay className="text-secondary-2" /> : <FaPause className="text-secondary-2" />}
      </button>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex space-x-6"
          initial={{ x: isMobile ? '0%' : '30%' }}
          animate={controls}
        >
          {testimonials.concat(testimonials).map((testimonial, index) => (
            <div
              key={index}
              className="bg-background p-6 rounded-lg w-[300px] flex-shrink-0 relative shadow-md cursor-pointer"
              onClick={() => openPopup(testimonial)}
            >
              <h3 className="text-xl font-semibold mb-2">{testimonial.name}</h3>
              <h4 className="text-sm text-text mb-4">{testimonial.title}</h4>
              <p className="text-grey-2">{testimonial.quote}</p>
              <div className="absolute top-4 right-4 text-secondary-2 text-4xl">
                <FaQuoteRight />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {selectedTestimonial && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-[500px] relative">
            <button
              className="absolute top-2 right-2 text-2xl text-grey-2"
              onClick={closePopup}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-2">{selectedTestimonial.name}</h3>
            <h4 className="text-sm text-text mb-4">{selectedTestimonial.title}</h4>
            <p className="text-grey-2">{selectedTestimonial.quote}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TestimonialSection;
