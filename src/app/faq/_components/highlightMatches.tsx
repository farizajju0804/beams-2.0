import React from 'react';

export const highlightMatches = (inputText: string, query: string): JSX.Element => {
  if (!query) {
    return <>{inputText}</>;
  }

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');

  // Split text by HTML tags to avoid affecting them
  const parts = inputText.split(/(<a.*?<\/a>|<.*?>)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('<a')) {
          // It's an anchor tag, preserve the link's functionality
          return (
            <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
          );
        } else if (part.startsWith('<')) {
          // It's any other HTML tag, render as is
          return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        } else {
          // This is plain text, apply the highlight
          return part.split(regex).map((subPart, subIndex) =>
            regex.test(subPart) ? (
              <span key={`${index}-${subIndex}`} className='bg-secondary-1'>{subPart}</span>
            ) : (
              subPart
            )
          );
        }
      })}
    </>
  );
};
