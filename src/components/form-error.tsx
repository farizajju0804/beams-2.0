import Image from "next/image";
import type { FC } from "react";
import {ExclamationTriangleIcon} from '@radix-ui/react-icons'
interface FormErrorProps {
  message?: string;
}

const FormError: FC<Readonly<FormErrorProps>> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
      <ExclamationTriangleIcon
        className="h-4 w-4"
      />
      <p>{message}</p>
    </div>
  );
};

export default FormError;