'use client';

import React from 'react';

interface UltrajayaLogoProps {
  collapsed?: boolean;
  size?: number;
}

export const UltrajayaLogo: React.FC<UltrajayaLogoProps> = ({ collapsed = false, size = 38 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Ultrajaya Clean Solid Flat Logo (No glow) */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #00529b 0%, #0077c8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: '80%', height: '80%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="milkDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
          </defs>

          {/* Stylized Bold 'U' of UltraJaya */}
          <path
            d="M 24 20 L 24 54 C 24 72, 36 82, 50 82 C 64 82, 76 72, 76 54 L 76 20 L 64 20 L 64 54 C 64 64, 58 70, 50 70 C 42 70, 36 64, 36 54 L 36 20 Z"
            fill="url(#milkDropGrad)"
          />

          {/* Dynamic Milk Drop Accent */}
          <circle cx="70" cy="18" r="6" fill="#ffffff" />
          <circle cx="50" cy="46" r="3.5" fill="#38bdf8" />

          {/* Wave curve accent */}
          <path
            d="M 28 44 Q 50 56 72 44"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: 1.1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ color: '#00529b' }}>ULTRA</span>
            <span style={{ color: '#0084d6' }}>JAYA</span>
          </div>
          <div
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '1px',
            }}
          >
            Milk Industry Tbk
          </div>
        </div>
      )}
    </div>
  );
};
