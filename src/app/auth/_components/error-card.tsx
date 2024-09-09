import BackButton from "@/app/auth/_components/back-button"; // Import BackButton component for navigation
import { Header } from "@/app/auth/_components/header"; // Import Header component for displaying a message
import { Card, CardFooter, CardHeader } from "@nextui-org/react"; // Import Card components from NextUI for UI structure

/**
 * ErrorCard component displays a UI message when an error occurs,
 * along with a button to redirect the user back to the login page.
 */
export const ErrorCard = () => {
    return (
        <Card className="w-[400px] shadow-md"> {/* Card with a fixed width and shadow effect */}
            <CardHeader>
                {/* Display an error message as the header */}
                <Header label="Oops! Something Went Wrong!" /> 
            </CardHeader>
            
            <CardFooter>
                {/* BackButton navigates the user to the login page */}
                <BackButton position="bottom" label="Back to login" href="/auth/login" />
            </CardFooter>
        </Card>
    );
};
