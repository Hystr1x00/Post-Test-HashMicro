'use client';

import React from 'react';
import { Package, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const DealDeckCards: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '16px',
        height: '100%',
      }}
    >
      {/* Card 1: Highlighted Solid Ultrajaya Brand Blue */}
      <div
        style={{
          backgroundColor: '#00529b',
          borderRadius: '16px',
          padding: '20px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid #00529b',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={20} color="#ffffff" />
          </div>
          <span
            style={{
              backgroundColor: '#10B981',
              color: '#ffffff',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '20px',
            }}
          >
            +2.08%
          </span>
        </div>

        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500, marginBottom: '4px' }}>
            Total Stock Valuation
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Rp 8.412 M
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Stock vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Batches On-Hand */}
      <div
        className="glass-card"
        style={{
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={18} color="#00529b" />
          </div>
          <span
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '20px',
            }}
          >
            +12.4%
          </span>
        </div>

        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
            Total Stock On-Hand
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              9.790
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Karton in 4 Gudang
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Expiring Soon (< 30 Hari) */}
      <div
        className="glass-card"
        style={{
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <span
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '20px',
            }}
          >
            -2.08%
          </span>
        </div>

        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
            Critical Expiry (&lt;30d)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#EF4444', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              550
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Karton FEFO Alert
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: FEFO Compliance Rate */}
      <div
        className="glass-card"
        style={{
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <span
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '20px',
            }}
          >
            +12.1%
          </span>
        </div>

        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
            FEFO Compliance Rate
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10B981', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              98.4%
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Accurate dispatch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
