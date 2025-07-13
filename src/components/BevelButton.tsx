import React, { useState } from 'react';

interface BevelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled: true | false;
}

const BevelButton: React.FC<BevelButtonProps> = ({ 
  children, 
  onClick, 
  type = "button",
  className = "",
  disabled
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={`
        relative px-6 py-3 font-bold text-white 
        bg-gradient-to-b from-blue-600 to-blue-700 
        border-2 border-gray-800
        rounded-lg
        shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.6),inset_2px_2px_4px_rgba(255,255,255,0.2)]
        active:shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.2)]
        active:translate-y-0.5
        transform transition-all duration-75
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
        ${className}
      `}
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 4px 8px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(0,0,0,0.6), inset 2px 2px 4px rgba(255,255,255,0.2)'
          : 'inset -2px -2px 4px rgba(0,0,0,0.6), inset 2px 2px 4px rgba(255,255,255,0.2)'
      }}
    >
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: isHovered 
            ? 'radial-gradient(circle at center, rgba(0, 195, 255, 0.2) 0%, transparent 70%)' 
            : 'transparent',
          opacity: isHovered ? 1 : 0
        }}
      />
      
      {/* Bevel effect elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-400/30 to-transparent pointer-events-none rounded-t-lg"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none rounded-b-lg"></div>
      
      {/* Content */}
      <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
        {children}
      </span>
    </button>
  );
};

export default BevelButton;