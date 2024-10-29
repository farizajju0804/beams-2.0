import React from "react"; // Importing React

// Props interface for the FormattedDate component
interface FormattedDateProps {
  date?: string; // Optional date prop in string format (YYYY-MM-DD)
}

// FormattedDate functional component
const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
  // Array of month names for formatting
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Destructure year, month, and day from the date string
  const [year, month, day]: any = date?.split("-"); // Split date string by "-" into an array

  // Construct the formatted date string (e.g., "January 1, 2024")
  const formattedDate = `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;

  // Render the formatted date inside a <span>
  return <span>{formattedDate}</span>;
};

export default FormattedDate; // Export the component for use in other parts of the application
