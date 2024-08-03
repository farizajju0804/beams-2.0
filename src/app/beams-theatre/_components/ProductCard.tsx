import React from 'react';
import { Card, Button, Image, CardBody, CardFooter } from '@nextui-org/react';
import { Star1, ShoppingCart } from 'iconsax-react';

const ProductCard = ({ item }:any) => {
  return (
    <Card shadow="sm" isPressable >
      <CardBody className="overflow-visible p-0">
        <Image
        
          shadow="sm"
          radius="lg"
          width="100%"
          alt={item.title}
          className="w-full object-cover h-[200px]"
          src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1721207429/Beams%20Theatre/Magical%20materials/poster_materials_qezdno.png"
        />
      </CardBody>
      <CardFooter className="flex flex-col items-start p-4">
        <h1 className='mb-4 text-lg lg:text-xl font-bold text-left'>{item.title}</h1>
        <div className="flex items-center justify-between w-full mb-4">
            <div className='w-fit flex gap-1  items-center'>
          <Image src="https://via.placeholder.com/20" alt="Beams Logo" width={20} height={20} />
          <span className="ml-1">Beams</span>
          </div>
          <div className="flex w-fit items-center ml-4 text-yellow-500">
            <Star1 size="12" variant="Bold" />
            <span className="ml-1 text-sm">4.8 (997 Review)</span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="text-xl font-bold">${item.discountPrice}</span>
            <span className="text-xs text-default-500 line-through ml-2">${item.originalPrice}</span>
          </div>
          <Button className="font-bold" color="warning" startContent={<ShoppingCart size="16" variant='Bold' />} onPress={() => console.log("Add to cart")}>
            Add to cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};



export default ProductCard;
