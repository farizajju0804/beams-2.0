import { Button } from "@nextui-org/react";

interface BackButtonProps {
    handleBack: () => void;
    disabled?: boolean;
  }
  
  const BackButton: React.FC<BackButtonProps> = ({ handleBack, disabled }) => {
    return (
      <Button
        onClick={handleBack}
        disabled={disabled}
        className={`px-6 py-3 bg-gray-200 text-gray-800 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Back
      </Button>
    );
  };
  
  export default BackButton;
  