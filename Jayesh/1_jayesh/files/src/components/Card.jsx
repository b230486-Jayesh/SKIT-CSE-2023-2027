import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
};

export default Card;
