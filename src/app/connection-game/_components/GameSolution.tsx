import React from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { ArrowLeft, ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';

interface GameSolutionProps {
  image: string;
  answer: string;
  title: string;
  hint: string;
  onBackToGame?: () => void;
  answerExplanation: string;
  solutionPoints: string[];
  showBackButton?: boolean;
}

export const GameSolution = ({ 
  image, 
  answer, 
  title, 
  hint, 
  onBackToGame,
  answerExplanation,
  solutionPoints,
  showBackButton = true
}: GameSolutionProps) => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
   
      

      <Card className="overflow-hidden">
        <CardHeader className="bg-default-50 border-b">
          <h2 className="text-xl md:text-2xl font-poppins font-medium text-center w-full">{title}</h2>
        </CardHeader>
        
        <CardBody className="px-6 pt-6 pb-1 space-y-8">
          {/* Main Image */}
          <div className="relative w-full max-w-sm mx-auto rounded-lg shadow-lg">
            <Image
              src={image}
              alt={title}
              width={800}
              height={800}
              className="object-contain h-fit w-full"
              priority
            />
          </div>

          {/* Answer Section */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-center">
              Answer: <span className="text-brand">{answer}</span>
            </h2>
          </div>

          {/* Solution Points */}
          <div className="space-y-4">
            <h3 className="text-lg font-poppins font-medium">Solution Breakdown:</h3>
            <ul className="text-sm list-disc pl-6 space-y-2">
              {solutionPoints.map((point, index) => (
                <li key={index} className="text-grey-2">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Answer Explanation */}
          <div className="space-y-4">
            <h3 className="text-lg font-poppins font-medium">Explanation:</h3>
            <div className="prose prose-blue max-w-none">
              {answerExplanation.split('\n\n').map((paragraph, index) => (
                <div key={index} className="mb-4">
                  <p className="text-sm text-grey-2">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
        <CardFooter>
        <Button
          as={Link}
          href='/connection-game'
          prefetch
          className="flex items-center mx-auto mb-2 font-semibold text-grey-2"
        >
          <ArrowLeft2 className="w-4 h-4 mr-1" />
          Back
        </Button>
        </CardFooter>
      </Card>
    </div>
  );
};