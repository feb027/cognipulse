'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
  isMono?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  maxLength,
  isMono = false,
  required = false,
  autoComplete = 'current-password',
  className = '',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          {label}
        </label>
      )}
      <div className="relative mt-1.5">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-apple-blue dark:focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20 outline-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors ${
            isMono ? 'font-mono' : ''
          } ${!showPassword && isMono ? 'tracking-widest' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-apple-blue/30 transition-all"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-apple-blue" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
