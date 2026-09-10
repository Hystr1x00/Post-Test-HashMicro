'use client';

import React from 'react';
import { WAREHOUSES } from '@/data/mockData';
import { ChevronDown, MapPin, Building2 } from 'lucide-react';

export const WarehouseBubbleChart: React.FC = () => {
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
            Warehouse Distribution
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Multi-warehouse physical stock allocation
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

      {/* Middle: Overlapping Circular Bubbles & Warehouse List (Matching DealDeck Image!) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '14px', alignItems: 'center', margin: '14px 0' }}>
        {/* Overlapping Bubbles Graphic */}
        <div style={{ position: 'relative', width: '150px', height: '140px', margin: '0 auto' }}>
          {/* Bubble 1: Cikarang Central (Big Royal Blue) */}
          <div
            style={{
              position: 'absolute',
              top: '15px',
              left: '10px',
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              backgroundColor: '#00529b',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              zIndex: 3,
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 800 }}>4.280</span>
            <span style={{ fontSize: '0.5625rem', opacity: 0.8 }}>Ckr</span>
          </div>

          {/* Bubble 2: Surabaya Hub (Cyan/Light Blue) */}
          <div
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '65px',
              height: '65px',
              borderRadius: '50%',
              backgroundColor: '#0077c8',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              zIndex: 2,
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>2.417</span>
            <span style={{ fontSize: '0.5625rem', opacity: 0.8 }}>Sby</span>
          </div>

          {/* Bubble 3: Bandung Depo (Sky Blue) */}
          <div
            style={{
              position: 'absolute',
              bottom: '5px',
              left: '30px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#0084d6',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 4,
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>2.281</span>
            <span style={{ fontSize: '0.5625rem', opacity: 0.8 }}>Bdg</span>
          </div>

          {/* Bubble 4: Medan Outer (Light Slate/Amber) */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '15px',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              backgroundColor: '#64748b',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <span style={{ fontSize: '0.6875rem', fontWeight: 800 }}>812</span>
            <span style={{ fontSize: '0.5rem', opacity: 0.8 }}>Mdn</span>
          </div>
        </div>

        {/* Warehouse Location List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
          {WAREHOUSES.map((wh) => (
            <div key={wh.warehouse_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: wh.color }} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.75rem' }}>
                  {wh.name.split(' ')[0]} {wh.name.split(' ')[1]}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {wh.current_stock.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>Total Kapasitas Terisi:</span>
        <span style={{ fontWeight: 700, color: '#00529b' }}>40.8% (9.790 / 24.000 Karton)</span>
      </div>
    </div>
  );
};
