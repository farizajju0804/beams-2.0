'use client'
import React, { useState } from 'react';
import BeamsTheatreCard from './BeamsTheatreCard';
import ProductCard from './ProductCard';


interface BeamsTheatreListSectionProps {
  initialData: any[];
  genres: any[];
}
const products = [
  {
    title: 'Magical Materials Of The Future',
    img: 'https://via.placeholder.com/300x140', // Replace with your image URL
    discountPrice: 20,
    originalPrice: 30,
  },
  
];
const BeamsTheatreListSection: React.FC<BeamsTheatreListSectionProps> = ({ initialData, genres }) => {
  const [theatreData, setTheatreData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  return (
    <div className="flex items-center flex-col justify-center max-w-5xl w-full 6 gap-12 relative mx-2 lg:mx-4">
      
      {products.map((item, index) => (
        <ProductCard key={index} item={item} />
      ))}

    </div>
  );
};

export default BeamsTheatreListSection;
