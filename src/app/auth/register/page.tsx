import Step1Form from "@/app/auth/_components/Step1"; // Importing the step 1 form for registration
import { getClientIp } from "@/utils/getClientIp"; // Utility function to get the client's IP address
import { Suspense } from "react"; // Importing Suspense for handling lazy loading of components
import RegisterSide from "../_components/RegisterSide"; // Component for the register side UI

/**
 * Page component for the registration process. 
 * It fetches the client's IP address and checks for any pending email verification.
 */
const Page = async () => {
  const ip = await getClientIp(); // Fetch the client's IP address

  return (
    // Wrapping the main content in Suspense for potential lazy loading
    <Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
        {/* Render the RegisterSide component on the left */}
        <RegisterSide />
        
        {/* Main content area where the registration step form is rendered */}
        <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
          {/* Pass the client's IP and pending email verification status to the Step1Form */}
          <Step1Form ip={ip}  />
        </div>
      </div>
    </Suspense>
  );
};

export default Page; // Exporting the component as the default export
