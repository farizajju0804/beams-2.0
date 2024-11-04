// app/components/ErrorPage.tsx
'use client';

import React from 'react';
import { Card, CardBody, Button, CardHeader } from "@nextui-org/react";
import { 
  Cloud, 
  Coffee, 
  SecuritySafe, 
  Warning2, 
  Ghost,
  Home2,
  MessageQuestion,
  ArrowRotateLeft,
  CloudCross,
  Danger
} from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';



const getErrorCode = (error: any): string => {
    // Check for API error responses
    if (error?.response?.status) {
      return error.response.status.toString();
    }
    
    // Check for Next.js specific error codes
    if (error?.digest) {
      // Next.js adds a digest to certain error types
      switch (error.digest) {
        case 'NEXT_NOT_FOUND':
          return '404';
        case 'NEXT_REDIRECT':
          return '307';
        default:
          break;
      }
    }
    
    // Check for custom error codes
    if (error?.statusCode) {
      return error.statusCode.toString();
    }
  
    // Check error message for status codes
    if (error?.message) {
      const statusMatch = error.message.match(/\b([345]\d{2})\b/);
      if (statusMatch) {
        return statusMatch[1];
      }
    }
  
    // Check for specific error types
    if (error instanceof TypeError) {
      return '400';
    }
    
    if (error?.name === 'UnauthorizedError') {
      return '401';
    }
    
    if (error?.name === 'ForbiddenError') {
      return '403';
    }
  
    // Default to 500 if no specific error code can be determined
    return '500';
  };

  
const ErrorPage = ({ 
  code = '404',
}: any) => {
  const router = useRouter();

  const getErrorInfo = (errorCode: any) => {
    switch (errorCode) {
      case '400':
        return {
          icon: <Warning2 size={48} variant="Bold" className="text-warning" />,
          title: "Oops! Tiny Mix-up!",
          description: "Looks like our robots got a little too creative with code! Time for a quick fix. 🤖✨",
          color: "primary"
        };
      case '401':
        return {
          icon: <SecuritySafe size={48} variant="Bold" className="text-danger" />,
          title: "VIP Zone Alert!",
          description: "This page is members-only! Don't worry; we’ll save you a spot once you’re in. 🎟️",
          color: "primary"
        };
      case '403':
        return {
          icon: <Ghost size={48} variant="Bold" className="text-danger" />,
          title: "Access Denied!",
          description: "It’s like that exclusive club you can’t get into…maybe try a different page? 💼",
          color: "primary"
        };
      case '404':
        return {
          icon: <CloudCross size={48} variant="Bold" className="text-primary" />,
          title: "Page is on a Break!",
          description: "The page you’re looking for has gone on a quick vacation. Hope it sends us a postcard! 🏖️",
          color: "primary"
        };
      case '500':
        return {
          icon: <Coffee size={48} variant="Bold" className="text-danger" />,
          title: "Server on Coffee Break!",
          description: "Our server is brewing some fresh energy. Please hang tight! ☕",
          color: "primary"
        };
      case '503':
        return {
          icon: <Danger size={48} variant="Bold" className="text-warning" />,
          title: "Service Timeout!",
          description: "The servers are practicing their yoga skills. Be back soon! 🧘‍♂️",
          color: "primary"
        };
      default:
        return {
          icon: <Warning2 size={48} variant="Bold" className="text-danger" />,
          title: "Something Went Wrong...",
          description: "Our tech wizards are on it! Just a little magic needed to fix this. 🔍✨",
          color: "primary"
        };
    }
  };

  const errorInfo = getErrorInfo(code);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-background via-background/80 to-background">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="flex flex-col gap-2 items-center justify-center pt-8">
          <div className="animate-bounce">
            {errorInfo.icon}
          </div>
          <h1 className="text-2xl font-bold text-center">
            {errorInfo.title}
          </h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-6 items-center text-center px-8 pb-8">
          <p className="text-default-500">
            { errorInfo.description}
          </p>

          {/* Display an image below the description */}
          <Image
            src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1730721652/authentication/error-image_ac0xc5.webp"
            alt="Error Illustration"
            width={200}
            height={200}
            className="mt-4 rounded-lg"
            priority
          />

          <div className="flex flex-col gap-6 w-full mt-6">
            <Button
              as={Link}
              href="/"
              color="primary"
              variant="shadow"
              startContent={<Home2 variant="Bold" />}
              className="text-lg font-medium text-white"
            >
              Back to Homepage
            </Button>

            <Button
              as={Link}
              href="/contact"
              variant="light"
              startContent={<MessageQuestion variant="Bold" />}
              className="text-lg font-medium"
            >
              Contact Us
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ErrorPage;
