"use client";

import { useEffect, useState } from 'react';

export const FormattedDateTime = ({ dateString }:any) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date(dateString);
    const formatted = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    setFormattedDate(formatted);
  }, [dateString]);

  // Show nothing during SSR
  if (!formattedDate) return null;

  return (
    <p className='mt-4 text-base font-medium text-default-500 mx-auto text-center'>
      {formattedDate}
    </p>
  );
};