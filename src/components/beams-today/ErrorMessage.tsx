
import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-lg font-bold text-red-500">{message}</p>
  </div>
);

export default ErrorMessage;
