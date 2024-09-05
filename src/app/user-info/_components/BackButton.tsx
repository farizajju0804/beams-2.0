import { Button } from "@nextui-org/react";
import { FaChevronLeft } from "react-icons/fa";

interface BackButtonProps {
    handleBack: () => void;
    disabled?: boolean;
  }
  
  const BackButton: React.FC<BackButtonProps> = ({ handleBack, disabled }) => {
    return (
      <Button
        isIconOnly
       
        onClick={handleBack}
        disabled={disabled}
        className={`px-3 py-3 text-white rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
       <FaChevronLeft/>
      </Button>
    );
  };
  
  export default BackButton;
  