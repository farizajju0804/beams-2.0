import { useEffect } from "react";
import type { FC } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { motion, useAnimation } from "framer-motion";

interface FormErrorProps {
  message?: string;
}

const FormError: FC<Readonly<FormErrorProps>> = ({ message }) => {
  const borderControls = useAnimation();
  const containerControls = useAnimation();

  useEffect(() => {
    if (message) {
      // Start the border shrinking animation
      borderControls.start({
        width: "0%",
        transition: { duration: 5, ease: "easeInOut" },
      }).then(() => {
        // After the border animation is complete, fade out the container
        containerControls.start({
          opacity: 0,
          height: 0,
          marginTop: 0,
          marginBottom: 0,
          transition: { duration: 0.3 },
        });
      });
    }
  }, [message, borderControls, containerControls]);

  return (
    message && (
      <motion.div
        initial={{ opacity: 1, height: "auto", marginTop: "1rem", marginBottom: "1rem" }}
        animate={containerControls}
        className="relative bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500 overflow-hidden"
      >
        <motion.div
          initial={{ width: "100%" }}
          animate={borderControls}
          className="absolute top-0 left-0 h-1 bg-red-500"
        />
        <ExclamationTriangleIcon className="h-4 w-4" />
        <p className="font-semibold">{message}</p>
      </motion.div>
    )
  );
};

export default FormError;
