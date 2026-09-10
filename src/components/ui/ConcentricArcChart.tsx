'use client';

import React from 'react';
import { Milk, Coffee, Leaf, ChevronDown } from 'lucide-react';

export const ConcentricArcChart: React.FC = () => {
  // Concentric arc calculation
  const size = 180;
  const strokeWidth = 8;
  const center = size / 2;

  // 3 concentric rings
  const ring1Radius = 75; // Outer: Fresh (>60d)
  const ring2Radius = 60; // Middle: Near Expiry (30-60d)
  const ring3Radius = 45; // Inner: Critical (<30d)

  const calcDash = (radius: number, percent: number) => {
    const circ = 2 * Math.PI * radius;
    const arcCirc = circ * 0.75; // 270 degree open arc
    const filled = (percent / 100) * arcCirc;
    return `${filled} ${circ}`;
  };

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Batch Expiry Statistic
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Track your batch shelf-life & FEFO readiness
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span>Today</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Middle Arc & Big Metric */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: '12px 0' }}>
        {/* SVG Multi-Arc Concentric */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Tracks */}
            <circle
              cx={center}
              cy={center}
              r={ring1Radius}
              fill="transparent"
              stroke="var(--border-subtle)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${2 * Math.PI * ring1Radius * 0.75} ${2 * Math.PI * ring1Radius}`}
              strokeLinecap="round"
              transform={`rotate(135 ${center} ${center})`}
            />
            <circle
              cx={center}
              cy={center}
              r={ring2Radius}
              fill="transparent"
              stroke="var(--border-subtle)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${2 * Math.PI * ring2Radius * 0.75} ${2 * Math.PI * ring2Radius}`}
              strokeLinecap="round"
              transform={`rotate(135 ${center} ${center})`}
            />
            <circle
              cx={center}
              cy={center}
              r={ring3Radius}
              fill="transparent"
              stroke="var(--border-subtle)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${2 * Math.PI * ring3Radius * 0.75} ${2 * Math.PI * ring3Radius}`}
              strokeLinecap="round"
              transform={`rotate(135 ${center} ${center})`}
            />

            {/* Active Concentric Rings */}
            {/* Outer Ring: Ultrajaya Blue (84% Fresh) */}
            <circle
              cx={center}
              cy={center}
              r={ring1Radius}
              fill="transparent"
              stroke="#00529b"
              strokeWidth={strokeWidth}
              strokeDasharray={calcDash(ring1Radius, 84)}
              strokeLinecap="round"
              transform={`rotate(135 ${center} ${center})`}
            />

            {/* Middle Ring: Cyan / Light Blue (48% Near Expiry) */}
            <circle
              cx={center}
              cy={center}
              r={ring2Radius}
              fill="transparent"
              stroke="#38BDF8"
              strokeWidth={strokeWidth}
              strokeDasharray={calcDash(ring2Radius, 48)}
              strokeLinecap="round"
              transform={`rotate(135 ${center} ${center})`}
            />

            {/* Inner Ring: Red (24% Critical) */}
            <circle
              cx={center}
              cy={center}
              r={ring3Radius}
              fill="transparent"
              stroke="#EF4444"
              strokeWidth={strokeWidth}
              strokeDasharray={calcDash(ring3Radius, 28)}
              strokeLinecap="round"
              transform={`rotate(135 ${center} ${center})`}
            />
          </svg>
        </div>

        {/* Big Number & Badge */}
        <div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            9.829
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Products In-Stock
          </div>
          <div style={{ marginTop: '6px' }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              +6.34%
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
        {/* Item 1 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00529b' }} />
            <Milk size={15} color="#00529b" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Susu UHT Fresh</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>2.487</span>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 6px', borderRadius: '10px' }}>
              +1.8%
            </span>
          </div>
        </div>

        {/* Item 2 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
            <Coffee size={15} color="#38BDF8" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Teh Kotak RTD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>1.828</span>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 6px', borderRadius: '10px' }}>
              +2.3%
            </span>
          </div>
        </div>

        {/* Item 3 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <Leaf size={15} color="#EF4444" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sari Kacang Ijo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>1.463</span>
            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 6px', borderRadius: '10px' }}>
              -1.04%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
