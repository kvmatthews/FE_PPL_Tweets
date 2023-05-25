import React from "react";

const TextToken = ({ tokenizeText }) => {
  return (
    <div>
      {tokenizeText.map((token, index) => (
        <span key={index}>'{token} ' </span>
      ))}
    </div>
  );
};

export default TextToken;