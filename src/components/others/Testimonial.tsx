import React from 'react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  title: string;
  bgColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Beams has been a game changer for my child's education. The interactive content keeps them engaged and excited to learn.",
    name: 'John Doe',
    role: 'Parent',
    avatar: 'https://picsum.photos/100?random=4',
    title: 'Beams transformed my child’s learning experience',
    bgColor: 'bg-orange-50'
  },
  {
    id: 2,
    quote: 'I’ve seen significant improvement in my child’s understanding of complex subjects thanks to Beams. The innovative approach is just what they needed.',
    name: 'Jane Smith',
    role: 'Parent',
    avatar: 'https://picsum.photos/100?random=5',
    title: 'A remarkable improvement in understanding',
    bgColor: 'bg-amber-200'
  },
  {
    id: 3,
    quote: 'The variety of learning formats offered by Beams caters perfectly to my child’s unique learning style. Highly recommended!',
    name: 'Emily Johnson',
    role: 'Parent',
    avatar: 'https://picsum.photos/100?random=6',
    title: 'Perfect for unique learning styles',
    bgColor: 'bg-orange-300'
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="w-full lg:w-1/3 p-4">
    <div className="border border-orange-500 bg-white p-8 flex flex-col justify-between rounded-t-3xl rounded-br-3xl mb-8 lg:h-full">
      <div className="mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="22" viewBox="0 0 30 22" fill="none">
          <path d="M13.1971 4.75862C10.9375 4.89655 9.11058 5.47127 7.71635 6.48276C6.37019 7.49425 5.57692 8.87356 5.33654 10.6207C5.28846 11.2184 5.28846 11.8621 5.33654 12.5517C5.72115 12 6.20192 11.6092 6.77885 11.3793C7.35577 11.1494 8.05289 11.0345 8.87019 11.0345C10.1683 11.0345 11.2981 11.5172 12.2596 12.4828C13.2212 13.4483 13.7019 14.7126 13.7019 16.2759C13.7019 17.977 13.125 19.3563 11.9712 20.4138C10.8173 21.4713 9.30289 22 7.42788 22C5.07212 22 3.24519 21.1724 1.94712 19.5172C0.649038 17.8161 0 15.5862 0 12.8276C0 9.47126 1.05769 6.57471 3.17308 4.13793C5.33654 1.65517 8.67789 0.275861 13.1971 0V4.75862ZM29.4952 4.75862C27.1875 4.89655 25.3606 5.47127 24.0144 6.48276C22.6683 7.49425 21.875 8.87356 21.6346 10.6207C21.5865 11.0345 21.5625 11.6782 21.5625 12.5517C21.9952 12 22.5 11.6092 23.0769 11.3793C23.6538 11.1494 24.351 11.0345 25.1683 11.0345C26.4663 11.0345 27.5962 11.5172 28.5577 12.4828C29.5192 13.4483 30 14.7126 30 16.2759C30 17.977 29.4231 19.3563 28.2692 20.4138C27.1154 21.4713 25.601 22 23.726 22C21.3221 22 19.4712 21.1724 18.1731 19.5172C16.9231 17.8161 16.2981 15.5862 16.2981 12.8276C16.2981 9.47126 17.3558 6.57471 19.4712 4.13793C21.6346 1.65517 24.976 0.275861 29.4952 0V4.75862Z" fill="#FF7100"></path>
        </svg>
      </div>
      <h2 className="text-xl font-bold font-heading mb-4">{testimonial.title}</h2>
      <p className="text-gray-600 mb-4">{testimonial.quote}</p>
      <div className="flex items-center gap-4 flex-wrap">
        <div className={`rounded-full ${testimonial.bgColor} overflow-hidden`}>
          <img src={testimonial.avatar} alt={testimonial.name} />
        </div>
        <div>
          <h2 className="font-semibold mb-1">{testimonial.name}</h2>
          <p className="text-gray-500 text-sm">{testimonial.role}</p>
        </div>
      </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => (
  <section className="py-12 bg-orange-100">
    <div className="container mx-auto px-4">
      <h1 className="text-center text-4xl lg:text-5xl font-bold font-display font-heading mb-3  ">Testimonials from Parents</h1>
      <p className="text-center text-gray-600 mb-10">See what they have to say about us</p>
      <div className="flex flex-wrap mb-6 lg:mb-8 -mx-4">
        {testimonials.map(testimonial => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
      {/* <div className="flex justify-center">
        <a className="w-full sm:w-auto text-center h-12 inline-flex items-center justify-center py-3 px-5 rounded-full bg-orange-500 border border-orange-600 shadow text-sm font-semibold text-white hover:bg-orange-600 focus:ring focus:ring-orange-200 transition duration-200" href="#">View more</a>
      </div> */}
    </div>
  </section>
);

export default Testimonials;
