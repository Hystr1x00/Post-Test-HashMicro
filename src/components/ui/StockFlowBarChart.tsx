'use client';

import React, { useState } from 'react';
import { MONTHLY_FLOW_DATA } from '@/data/mockData';
import { ChevronDown } from 'lucide-react';

export const StockFlowBarChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(3); // Default hover on Apr like the image!

  const maxValue = 60000;
  const chartHeight = 180;

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Stock Movements & Flow
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Track inbound finished goods vs outbound FEFO dispatch
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
          <span>This year</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Inbound In (Pabrik)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00529b' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Outbound FEFO (Sales)</span>
        </div>
      </div>

      {/* SVG Bar Canvas */}
      <div style={{ position: 'relative', width: '100%', height: `${chartHeight + 40}px` }}>
        {/* Y Axis Grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: `0 0 30px 40px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          {['60K', '40K', '20K', '0K'].map((label, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderBottom: i === 3 ? '1px solid var(--border-subtle)' : '1px dashed var(--border-subtle)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '-36px',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div
          style={{
            position: 'absolute',
            left: '40px',
            right: '10px',
            bottom: '30px',
            height: `${chartHeight}px`,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
          }}
        >
          {MONTHLY_FLOW_DATA.map((item, idx) => {
            const inHeight = (item.incoming / maxValue) * chartHeight;
            const outHeight = (item.outgoing / maxValue) * chartHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  width: '44px',
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                {/* Floating Black Pill Tooltip on Hover (Like DealDeck image!) */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: `-${Math.max(inHeight, outHeight) + 30}px`,
                      backgroundColor: '#0F172A',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
                      zIndex: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      minWidth: '130px',
                      animation: 'fadeIn 0.15s ease',
                      pointerEvents: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                      <span style={{ fontWeight: 600 }}>{item.incoming.toLocaleString('id-ID')}</span> Inbound
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00529b' }} />
                      <span style={{ fontWeight: 600 }}>{item.outgoing.toLocaleString('id-ID')}</span> Outgoing
                    </div>
                  </div>
                )}

                {/* Bars Pair */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                  {/* Inbound Bar (Gray) */}
                  <div
                    style={{
                      width: '12px',
                      height: `${inHeight}px`,
                      backgroundColor: '#E2E8F0',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  {/* Outbound Bar (Royal Blue) */}
                  <div
                    style={{
                      width: '12px',
                      height: `${outHeight}px`,
                      backgroundColor: '#00529b',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                </div>

                {/* Month Label */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-22px',
                    fontSize: '0.75rem',
                    color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: isHovered ? 700 : 500,
                  }}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
