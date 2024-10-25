import { FlipWords } from '@/components/ui/flip-words';
import Image from 'next/image'; // Import optimized image component from Next.js
import Link from 'next/link'; // Import Link component for client-side navigation
import React from 'react'; // Import React
import { FaStar } from 'react-icons/fa'; // Import star icon from react-icons for UI elements

/**
 * RegisterSide component displays the left-side content of a registration page.
 * It includes a logo, motivational text, feature highlights, and an image.
 */
const RegisterSide = () => {
  const words = ["Unlock","Discover","Explore", "Ignite", "Uncover","Awaken"];
  return (
    <div className="lg:min-h-screen p-4 m-0 flex flex-col items-center justify-center xl:justify-around gap-5 bg-yellow w-full">
      
      {/* Logo Section */}
      <div className="flex items-start w-full pl-2 md:pl-6">
        <Link href="/">
          <Image src="/images/logo.png" alt="Beams Logo" width={85} height={30} /> {/* Company Logo */}
        </Link>
      </div>

      {/* Header Text Section */}
      <div className="flex flex-col items-start gap-3 w-full pl-2 md:pl-6">
        <div className="flex items-center gap-1">
        <FlipWords className='font-poppins text-2xl md:text-3xl font-semibold text-purple' words={words} />
          <span className="font-poppins text-2xl md:text-3xl text-black">the</span> {/* "the" text */}
        </div>
        <h1 className="font-poppins text-2xl md:text-3xl text-black">Future with Beams</h1> {/* Main headline */}
      </div>

      {/* Feature Highlights Section */}
      <div className="pl-6 hidden lg:flex flex-col w-full items-start gap-6"> {/* Hidden on smaller screens */}
        {/* Feature 1 */}
        <div className="flex items-start space-x-2">
          <FaStar className="text-purple w-4 h-4 mt-1" /> {/* Star icon */}
          <div>
            <h3 className="text-purple text-lg font-bold">Stay Ahead of the Curve</h3> {/* Feature title */}
            <p className="text-black">Discover the latest futuristic ideas before they hit the mainstream</p> {/* Feature description */}
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-start space-x-2">
          <FaStar className="text-purple w-4 h-4 mt-1" /> {/* Star icon */}
          <div>
            <h3 className="text-purple text-lg font-bold">Lead the Way</h3> {/* Feature title */}
            <p className="text-black">Learn about the latest technological advancements and innovations.</p> {/* Feature description */}
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-start space-x-2">
          <FaStar className="text-purple w-4 h-4 mt-1" /> {/* Star icon */}
          <div>
            <h3 className="text-purple text-lg font-bold">2 Minute to Futuristic Bliss</h3> {/* Feature title */}
            <p className="text-black">Experience the thrill of learning about the future in just 2 minutes.</p> {/* Feature description */}
          </div>
        </div>
      </div>

      {/* Character Image Section */}
      <Image
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725356323/authentication/charcater-signup-2-dev_bfvtxh.webp"
        alt="login"
        width={200}
        height={200}
        priority
        className="hidden md:block" // Image hidden on smaller screens
      />
    </div>
  );
}

export default RegisterSide; // Export the component for use in other parts of the app
