import Step1Form from "@/app/auth/_components/Step1"; // Importing the step 1 form for registration
import { Suspense } from "react"; // Importing Suspense for handling lazy loading of components
import RegisterSide from "../_components/RegisterSide"; // Component for the register side UI


import { shareMetadataConfig } from '@/constants/shareMetadata'
import { Metadata } from "next";


type Props = {
  searchParams: { referral?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const isReferral = !!searchParams.referral

  // Different metadata for referral vs direct registration
  const metadata = isReferral ? {
    title: shareMetadataConfig.referral.title,
    description: shareMetadataConfig.referral.description,
    imageUrl: shareMetadataConfig.referral.imageUrl,
    imageAlt: "Join Beams with Referral Bonus"
  } : {
    title: "Join Beams - Next-gen Learning Platform",
    description: "Start your learning journey with Beams. Access exclusive content, learn emerging topics, and earn rewards as you learn.",
    imageUrl: "https://res.cloudinary.com/your-cloud/path/to/registration-preview.webp",
    imageAlt: "Join Beams Learning Platform"
  }

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: metadata.imageUrl,
          width: 1200,
          height: 630,
          alt: metadata.imageAlt,
        },
      ],
      type: 'website',
      siteName: 'Beams',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [metadata.imageUrl],
    },
  }
}
/**
 * Page component for the registration process. 
 * It fetches the client's IP address and checks for any pending email verification.
 */
const Page = async () => {


  return (
    // Wrapping the main content in Suspense for potential lazy loading
    <Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
        {/* Render the RegisterSide component on the left */}
        <RegisterSide />
        
        {/* Main content area where the registration step form is rendered */}
        <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
          {/* Pass the client's IP and pending email verification status to the Step1Form */}
          <Step1Form   />
        </div>
      </div>
    </Suspense>
  );
};

export default Page; // Exporting the component as the default export
