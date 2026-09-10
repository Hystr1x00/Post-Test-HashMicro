'use client';

import React, { useState } from 'react';
import { ChartDataPoint, CategoryShare } from '@/types';
import { CHART_DATA_WEEKLY, CHART_DATA_MONTHLY, CATEGORY_SHARES } from '@/data/mockData';
import { Calendar, DollarSign, Target, TrendingUp, Layers } from 'lucide-react';

export const RevenueChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data: ChartDataPoint[] = timeRange === 'weekly' ? CHART_DATA_WEEKLY : CHART_DATA_MONTHLY;

  // Chart dimensions
  const width = 760;
  const height = 280;
  const paddingX = 40;
  const paddingY = 30;

  const maxRevenue = Math.max(...data.map((d) => Math.max(d.revenue, d.target, d.expenses))) * 1.15;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Point generator
  const getCoordinates = (index: number, value: number) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (value / maxRevenue) * chartHeight;
    return { x, y };
  };

  // Build SVG path strings
  const revenuePoints = data.map((d, i) => getCoordinates(i, d.revenue));
  const targetPoints = data.map((d, i) => getCoordinates(i, d.target));
  const expensePoints = data.map((d, i) => getCoordinates(i, d.expenses));

  const revenueLine = `M ${revenuePoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const revenueArea = `M ${revenuePoints.map((p) => `${p.x},${p.y}`).join(' L ')} L ${revenuePoints[revenuePoints.length - 1].x},${height - paddingY} L ${revenuePoints[0].x},${height - paddingY} Z`;

  const targetLine = `M ${targetPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const expenseLine = `M ${expensePoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;

  const formatRupiahShort = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)}M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)}jt`;
    return `Rp ${val}`;
  };

  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Chart Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Analisis Pendapatan & Target
            </h3>
            <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
              <TrendingUp size={12} /> +18.4%
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Perbandingan realisasi pendapatan, target proyeksi, dan beban operasional
          </p>
        </div>

        {/* Range Selector & Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Time range switch */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setTimeRange('weekly')}
              className="btn"
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                backgroundColor: timeRange === 'weekly' ? 'var(--primary)' : 'transparent',
                color: timeRange === 'weekly' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className="btn"
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                backgroundColor: timeRange === 'monthly' ? 'var(--primary)' : 'transparent',
                color: timeRange === 'monthly' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              Bulanan
            </button>
          </div>
        </div>
      </div>

      {/* Legend items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8125rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6366F1' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Realisasi Revenue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '2px', backgroundColor: '#06B6D4' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Target Proyeksi</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '2px', backgroundColor: '#F59E0B' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Biaya Operasional</span>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto', minHeight: '280px' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', minWidth: '600px', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * chartHeight;
            const labelVal = ratio * maxRevenue;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontFamily="inherit"
                >
                  {formatRupiahShort(labelVal)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={revenueArea} fill="url(#revenueGrad)" />

          {/* Lines */}
          <path
            d={targetLine}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
          <path
            d={expenseLine}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={revenueLine}
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive column hover zones and point dots */}
          {data.map((d, i) => {
            const revPt = getCoordinates(i, d.revenue);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Vertical guideline on hover */}
                {isHovered && (
                  <line
                    x1={revPt.x}
                    y1={paddingY}
                    x2={revPt.x}
                    y2={height - paddingY}
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Point dot on line */}
                <circle
                  cx={revPt.x}
                  cy={revPt.y}
                  r={isHovered ? 6 : 4}
                  fill="#6366F1"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* X Axis label */}
                <text
                  x={revPt.x}
                  y={height - paddingY + 20}
                  textAnchor="middle"
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'}
                  fontSize="11"
                  fontWeight={isHovered ? 600 : 400}
                  fontFamily="inherit"
                >
                  {d.label}
                </text>

                {/* Invisible hover trigger area */}
                <rect
                  x={revPt.x - chartWidth / (data.length * 2)}
                  y={paddingY}
                  width={chartWidth / data.length}
                  height={chartHeight}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Card */}
        {hoveredData && hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: `calc(${paddingX + (hoveredIndex / (data.length - 1)) * (100 - (paddingX * 200) / width)}% - 90px)`,
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-lg)',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '180px',
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Periode: {hoveredData.label} (Total {hoveredData.orders} Transaksi)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#818cf8', fontWeight: 500 }}>Revenue:</span>
                <span style={{ fontWeight: 600 }}>Rp {hoveredData.revenue.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#22d3ee', fontWeight: 500 }}>Target:</span>
                <span style={{ fontWeight: 600 }}>Rp {hoveredData.target.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#fbbf24', fontWeight: 500 }}>Biaya:</span>
                <span style={{ fontWeight: 600 }}>Rp {hoveredData.expenses.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CategoryBreakdownChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const totalValue = CATEGORY_SHARES.reduce((acc, curr) => acc + curr.value, 0);

  // Donut SVG parameters
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Distribusi Kategori Produk
          </h3>
          <span className="badge badge-info">
            <Layers size={12} /> 4 Kategori
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Porsi kontribusi pendapatan per lini bisnis
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
        {/* SVG Donut Circle */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {CATEGORY_SHARES.map((item, idx) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeOffset;
              cumulativeOffset += (item.percentage / 100) * circumference;

              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transformOrigin: 'center',
                    transform: 'rotate(-90deg)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    opacity: hoveredIdx === null || isHovered ? 1 : 0.45,
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Donut Center text */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Omzet</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Rp 2.84M
            </div>
          </div>
        </div>

        {/* Legend & percentage bars */}
        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CATEGORY_SHARES.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: hoveredIdx === idx ? 'var(--bg-surface-elevated)' : 'transparent',
                transition: 'background-color var(--transition-fast)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: item.color }}>
                  {item.percentage}%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'var(--border-subtle)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
