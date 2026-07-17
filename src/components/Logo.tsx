import React from 'react';
import logoImg from '../assets/images/logofcshop.png';

interface LogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
}

export default function Logo({ className = '', height = '40', width }: LogoProps) {
  const formatDim = (val?: number | string) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === 'number') return `${val}px`;
    if (/^\d+$/.test(val)) return `${val}px`;
    return val;
  };

  return (
    <img
      src={logoImg}
      alt="Free Cell Shop"
      style={{
        height: formatDim(height) || '40px',
        width: formatDim(width) || 'auto',
      }}
      className={`select-none object-contain ${className}`}
      id="brand-logo-img"
    />
  );
}
