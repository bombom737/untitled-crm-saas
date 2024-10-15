import React from 'react';

interface CircleIconProps {
  color: string;
  size?: number; // optional size prop to control the circle size
}

const CircleIcon: React.FC<CircleIconProps> = ({ color, size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill={color} />
    </svg>
  );
};

export default CircleIcon;
