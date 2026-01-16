import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-terminal-border rounded ${className}`} />
);

export const CardSkeleton = () => (
  <div className="card-terminal p-6">
    <Skeleton className="h-4 w-24 mb-4" />
    <Skeleton className="h-8 w-40 mb-3" />
    <Skeleton className="h-4 w-16" />
  </div>
);

export default Skeleton;
