import { useEffect, useState } from "react";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import type { FC } from "react";
import { motion, useAnimation } from "framer-motion";

interface FormSuccessProps {
  message?: string;
  onHide?: () => void; 
}

const FormSuccess: FC<Readonly<FormSuccessProps>> = ({ message, onHide }) => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // Start the fade-out after 2 seconds
      const timeout = setTimeout(() => {
        controls.start({ opacity: 0, height: 0, transition: { duration: 0.5 } }).then(() => {
          setIsVisible(false);
          if (onHide) onHide(); // Optionally call the onHide callback after fade out
        });
      }, 2000);

      return () => clearTimeout(timeout); // Clear timeout if the component is unmounted
    }
  }, [message, controls, onHide]);

  return (
    <motion.div
      initial={{ opacity: 1, height: "auto" }}
      animate={controls}
      style={{ overflow: "hidden" }}  // Ensures smooth height transition
    >
      {isVisible && (
        <div className="bg-emerald-500 p-3 rounded-md flex items-center gap-x-2 font- font-medium text-sm text-white">
          <CheckCircledIcon className="h-4 w-4" />
          <p>{message}</p>
        </div>
      )}
    </motion.div>
  );
};

export default FormSuccess;
