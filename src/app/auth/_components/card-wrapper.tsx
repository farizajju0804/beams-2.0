"use client"; // Ensures this component runs on the client side
import type { FC } from "react"; // Import React's FC (Function Component) type for typing the component
import BackButton from "@/app/auth/_components/back-button"; // Import BackButton component
import { Header } from "@/app/auth/_components/header"; // Import Header component for displaying the header label
import Social from "@/app/auth/_components/social"; // Import Social component for displaying social login options
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"; // Import Card components from NextUI

// Define the interface for the CardWrapper component's props
interface CardWrapperProps {
  children: React.ReactNode; // The child elements to be rendered inside the card
  headerLabel: string; // The main header label for the card
  subMessage?: string; // An optional sub-message to display below the header
  backButtonLabel?: string; // Optional label for the back button
  backButtonSubText?: string; // Optional subtext for the back button
  backButtonPosition?: "top" | "bottom"; // Optional position for the back button, either at the top or bottom
  backButtonHref?: string; // Optional link for the back button's destination
  showSocial?: boolean; // Optional flag to show or hide the social login component
}

/**
 * CardWrapper is a reusable component that wraps content inside a card layout.
 * It can display a header, an optional sub-message, and optional back buttons at the top or bottom.
 */
const CardWrapper: FC<Readonly<CardWrapperProps>> = ({
  children, // The content to be rendered inside the card
  headerLabel, // The label for the card header
  backButtonLabel, // The label for the back button
  backButtonSubText, // Optional subtext for the back button
  backButtonHref, // The link for the back button
  backButtonPosition, // Position of the back button (top or bottom)
  showSocial, // Boolean to determine whether to show social login options
  subMessage, // Optional sub-message to be displayed below the header
}) => {
  return (
    <Card className="w-full max-w-lg px-4 pb-4 shadow-none"> {/* Card container with styling */}
      
      {/* Card Header with optional back button at the top */}
      <CardHeader className="mt-2 flex flex-col md:flex-row items-start md:items-center gap-4 w-full py-4 justify-between">
        <Header label={headerLabel} /> {/* Header component with the provided label */}
        
        {/* Render back button at the top if the position is set to "top" */}
        {backButtonLabel && backButtonHref && backButtonPosition === "top" && (
          <BackButton 
            position="top" 
            subText={backButtonSubText} 
            label={backButtonLabel} 
            href={backButtonHref} 
          />
        )}
      </CardHeader>

      {/* Optional sub-message displayed below the header */}
      {subMessage && (
        <p className="px-3 mb-4 text-left font-medium text-text">
          {subMessage}
        </p>
      )}

      {/* Optional social login buttons */}
      {showSocial && <Social />}

      {/* Card body where children content is rendered */}
      <CardBody>{children}</CardBody>
     
      {/* Render back button at the bottom if the position is set to "bottom" */}
      {backButtonLabel && backButtonHref && backButtonPosition === "bottom" && (
        <CardFooter className="p-0">
          <BackButton 
            position="bottom" 
            subText={backButtonSubText} 
            label={backButtonLabel} 
            href={backButtonHref} 
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default CardWrapper; // Export the CardWrapper component as the default export
