
import React from "react";

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

const LinkifiedText = ({ text, className = "" }: LinkifiedTextProps) => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split the text by URLs and create an array of text and link elements
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];
  
  // Create an array to hold the parts (text and links)
  const elements: React.ReactNode[] = [];
  
  // Combine text and links in order
  parts.forEach((part, index) => {
    // Add text part
    elements.push(<span key={`text-${index}`}>{part}</span>);
    
    // Add link if there is a match for this position
    if (matches[index]) {
      elements.push(
        <a 
          key={`link-${index}`} 
          href={matches[index]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-auction-purple hover:underline"
        >
          {matches[index]}
        </a>
      );
    }
  });
  
  return <div className={className}>{elements}</div>;
};

export default LinkifiedText;
