'use client';

import React from 'react';
import { MetricItem } from '@/types';
import { TrendingUp, TrendingDown, ShoppingBag, Package, Users, DollarSign } from 'lucide-react';

interface MetricCardProps {
  metric: MetricItem;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, onClick }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'TrendingUp':
        return <TrendingUp size={20} color={metric.color} />;
      case 'ShoppingBag':
        return <ShoppingBag size={20} color={metric.color} />;
      case 'Package':
        return <Package size={20} color={metric.color} />;
      case 'Users':
        return <Users size={20} color={metric.color} />;
      default:
        return <DollarSign size={20} color={metric.color} />;
    }
  };

  // Sparkline path generator
  const renderSparkline = () => {
    const data = metric.sparklineData;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 36;
    
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    });

    const pathString = `M ${points.join(' L ')}`;
    const areaString = `M ${points.join(' L ')} L ${width},${height} L 0,${height} Z`;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100px', height: '36px', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`grad-${metric.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={metric.color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={metric.color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaString} fill={`url(#grad-${metric.id})`} />
        <path
          d={pathString}
          fill="none"
          stroke={metric.color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className="glass-card"
      style={{
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-medium)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Top row: Title and Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {metric.title}
        </span>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: `${metric.color}18`,
            border: `1px solid ${metric.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {getIcon(metric.iconName)}
        </div>
      </div>

      {/* Middle row: Big Value & Sparkline */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h3
            style={{
              fontSize: '1.625rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {metric.value}
          </h3>
        </div>
        <div>{renderSparkline()}</div>
      </div>

      {/* Bottom row: Percentage badge and timeframe */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
        <span
          className={`badge ${metric.isPositive ? 'badge-success' : 'badge-danger'}`}
          style={{ padding: '2px 8px' }}
        >
          {metric.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {metric.isPositive ? `+${metric.changePercent}%` : `${metric.changePercent}%`}
        </span>
        <span style={{ color: 'var(--text-muted)' }}>{metric.timeframe}</span>
      </div>
    </div>
  );
};
