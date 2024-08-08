'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteRight } from 'react-icons/fa';

const testimonials = [
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
//   const [duration, setDuration] = useState(30);
  
  const isMobile = window.innerWidth <  767;
  const duration = isMobile ? 30 : 20

  return (
    <div className="bg-secondary-1 text-text rounded-3xl py-8 px-6 relative overflow-hidden">
      <h2 className="text-xl lg:text-2xl font-bold font-poppins text-center mb-4">Testimonials</h2>
      <p className="text-center text-sm lg:text-base mb-8 text-grey-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus consequatur reprehenderit.</p>
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex space-x-6"
          initial={{ x: isMobile ? '0%' : '30%' }}
          animate={{ x: '-100%' }}
          transition={{ repeat: Infinity,duration , ease: 'linear' }}
        >
          {testimonials.concat(testimonials).map((testimonial, index) => (
            <div
              key={index}
              className="bg-background p-6 rounded-lg w-[300px] flex-shrink-0 relative shadow-md"
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
    </div>
  );
};

export default TestimonialSection;
