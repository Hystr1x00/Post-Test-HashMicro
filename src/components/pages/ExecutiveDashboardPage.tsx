'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import {
  Factory,
  Building2,
  TrendingUp,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  FileSpreadsheet,
  PlusCircle,
  ArrowRightLeft,
  Calendar,
} from 'lucide-react';
import { WAREHOUSES, PRODUCTS } from '@/data/mockData';
import { LowStockRecommenderWidget } from '@/components/ui/LowStockRecommenderWidget';

interface ExecutiveDashboardPageProps {
  onNavigate: (tabId: string) => void;
}

export const ExecutiveDashboardPage: React.FC<ExecutiveDashboardPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const executiveKPIs = [
    {
      id: 'prod-output',
      title: 'Total Produksi Hari Ini',
      value: '18.450 Karton',
      subtext: 'Lini A, B, C Pabrik Cikarang',
      change: '+14.2%',
      isPositive: true,
      icon: Factory,
      color: '#00529b',
    },
    {
      id: 'stock-valuation',
      title: 'Total Nilai Inventaris',
      value: 'Rp 8.412.917.000',
      subtext: 'Tersebar di 4 Gudang Regional',
      change: '+2.08%',
      isPositive: true,
      icon: Layers,
      color: '#10B981',
    },
    {
      id: 'fulfillment-rate',
      title: 'Order Fulfillment (SLA)',
      value: '99.2%',
      subtext: '1.420 Order Terkirim Tepat Waktu',
      change: '+1.8%',
      isPositive: true,
      icon: CheckCircle2,
      color: '#8B5CF6',
    },
    {
      id: 'spoilage-rate',
      title: 'Tingkat Waste / Spoilage',
      value: '0.3%',
      subtext: 'Target Maksimal: 1.5%',
      change: '-12.5%',
      isPositive: true, // drop in waste is positive!
      icon: ShieldCheck,
      color: '#F59E0B',
    },
  ];

  const recentBatchesProduced = [
    {
      batchNo: 'BTH-202609-012',
      product: 'Ultra Milk Full Cream 1000ml',
      line: 'Lini Tetra Pak A (Cikarang)',
      qty: '3.200 Karton',
      time: '15 menit lalu',
      qaStatus: 'Passed QA Aseptik',
    },
    {
      batchNo: 'BTH-202609-011',
      product: 'Teh Kotak Jasmine 300ml',
      line: 'Lini Brik B (Cikarang)',
      qty: '2.800 Karton',
      time: '1 jam lalu',
      qaStatus: 'Passed QA Aseptik',
    },
    {
      batchNo: 'BTH-202609-010',
      product: 'Ultra Mimi Kids Vanilla 125ml',
      line: 'Lini Mini Pack C (Cikarang)',
      qty: '4.500 Karton',
      time: '3 jam lalu',
      qaStatus: 'Passed QA Aseptik',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-success">
              <Zap size={12} /> EXECUTIVE COMMAND CENTER
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • Monitoring Lini Manufaktur & Logistik PT. Ultra Jaya
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Executive Operations Overview
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Ringkasan produktivitas pabrik, utilisasi kapasitas gudang nasional, dan performa SLA pengiriman.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => onNavigate('warehouses')} className="btn btn-secondary">
            <Building2 size={15} /> Status Gudang
          </button>
          <button onClick={() => onNavigate('report')} className="btn btn-primary">
            <ArrowUpRight size={15} /> Buka Laporan FEFO
          </button>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {executiveKPIs.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.id}
              className="glass-card"
              style={{
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
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
                    backgroundColor: `${kpi.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} color={kpi.color} />
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                  {kpi.change}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {kpi.title}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {kpi.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Low Stock Alert & Smart Replenishment Auto-Recommender Widget */}
      <LowStockRecommenderWidget />

      {/* Middle Grid: Multi-Warehouse Status Snapshot + Production Inbound Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        {/* Left: 4 Warehouses Capacity & Operations Snapshot */}
        <div
          className="glass-card"
          style={{
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="#00529b" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Kapasitas Gudang Regional (Live Occupancy)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('warehouses')}
                style={{ background: 'transparent', border: 'none', color: '#0077c8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Lihat Detail Depo →
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Monitoring tingkat okupansi ruang simpan di seluruh sentra logistik
            </p>
          </div>

          {/* Warehouse list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {WAREHOUSES.map((wh) => {
              const occupancy = Math.round((wh.current_stock / wh.capacity) * 100);

              return (
                <div key={wh.warehouse_id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: wh.color }} />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{wh.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {wh.current_stock.toLocaleString('id-ID')} / {wh.capacity.toLocaleString('id-ID')} Karton ({occupancy}%)
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '7px', backgroundColor: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${occupancy}%`,
                        height: '100%',
                        backgroundColor: wh.color,
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Status Pendingin Aseptik Semua Gudang:</span>
            <span style={{ fontWeight: 700, color: '#10B981' }}>✅ Optimal (20°C - 23°C)</span>
          </div>
        </div>

        {/* Right: Real-time Finished Goods Inbound Feed from Factory */}
        <div
          className="glass-card"
          style={{
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Factory size={18} color="#10B981" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Batch Produksi Baru (Inbound Pabrik)
                </h3>
              </div>
              <span className="badge badge-success">Live Lini Produksi</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Hasil pengepakan steril yang baru masuk ke sistem karantina & gudang
            </p>
          </div>

          {/* Stream list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentBatchesProduced.map((b, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                      {b.product}
                    </span>
                    <span style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: '#0077c8' }}>
                      ({b.batchNo})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {b.line} • {b.time}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {b.qty}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                    {b.qaStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('movements')}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.75rem' }}
          >
            Lihat Riwayat Lengkap Pergerakan Stok →
          </button>
        </div>
      </div>
    </div>
  );
};
