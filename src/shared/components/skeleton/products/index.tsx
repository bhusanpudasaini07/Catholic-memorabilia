import React from 'react';

const SkeletonLoadingCard = () => {
  return (
    <div className="card bg-base-100 border plant-card">
      <figure className="bg-gray-300 mb-4 h-80 animate-pulse"></figure>
      <div className="h-5 bg-gray-300 rounded mb-3 mx-4 w-20 animate-pulse"></div>
      <div className="h-5 bg-gray-300 rounded mb-3 mx-4 w-40 animate-pulse"></div>
      <div className="h-5 bg-gray-300 rounded mb-3 mx-4 w-24 animate-pulse"></div>
    </div>
  );
};

export default SkeletonLoadingCard;