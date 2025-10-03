import React from 'react';
import { motion } from 'framer-motion';

interface BrutalButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false
}) => {
  const baseClasses = "font-brutal font-black uppercase tracking-wide border-4 border-brutal-black transition-all duration-100";
  
  const variantClasses = {
    primary: "bg-brutal-white text-brutal-black hover:bg-brutal-yellow",
    secondary: "bg-brutal-black text-brutal-white hover:bg-brutal-pink hover:text-brutal-black",
    accent: "bg-brutal-lime text-brutal-black hover:bg-brutal-cyan"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm shadow-brutal-sm",
    md: "px-6 py-3 text-base shadow-brutal",
    lg: "px-8 py-4 text-lg shadow-brutal-lg"
  };
  
  return (
    <motion.button
      whileHover={!disabled ? { y: -2, x: -2 } : {}}
      whileTap={!disabled ? { y: 0, x: 0, boxShadow: "4px 4px 0px #000000" } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};
