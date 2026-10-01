/**
 * Atomic UI: Button
 * Mematuhi filosofi Emil Kowalski: tactile scale-97 pada :active, transisi presisi,
 * dan aturan Anti-Slop: hairline 1px border tanpa glow ungu.
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-transform duration-75 active:scale-[0.97] focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = {
    primary:
      'bg-cockpit-cyan text-zinc-950 hover:bg-cyan-400 font-semibold border border-cyan-400/50 shadow-sm',
    secondary:
      'bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700',
    danger:
      'bg-cockpit-crimson text-white hover:bg-rose-600 font-semibold border border-rose-500/50',
    outline:
      'bg-transparent text-zinc-300 hover:bg-zinc-900 border border-zinc-700 hover:border-zinc-500',
    ghost:
      'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
