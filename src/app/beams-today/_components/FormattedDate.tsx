import React from "react";

interface FormattedDateProps {
  date: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [year, month, day] = date.split("-");
  const formattedDate = `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;

  return <span>{formattedDate}</span>;
};

export default FormattedDate;
