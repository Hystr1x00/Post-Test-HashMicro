'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  Zap,
  Building,
} from 'lucide-react';

export const FEFOInsightsSection: React.FC = () => {
  const { showToast } = useToast();
  const [isTransferring, setIsTransferring] = useState(false);
  const [dispatchedQueue, setDispatchedQueue] = useState<number[]>([]);

  const handleApplyRebalance = () => {
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      showToast(
        'Surat Perintah Transfer (TO-2026-088) dibuat: 200 Karton Ultra Milk dari Cikarang ke Medan Hub.',
        'success',
        'Mutasi Otomatis Dijadwalkan'
      );
    }, 600);
  };

  const handleQuickDispatch = (queueId: number, name: string) => {
    setDispatchedQueue((prev) => [...prev, queueId]);
    showToast(
      `Delivery Order dibuat! Batch ${name} diprioritaskan keluar via FEFO ke armada logistik.`,
      'success',
      'Dispatch Berhasil'
    );
  };

  const urgentQueue = [
    {
      id: 1,
      batch: 'BTH-202607-001',
      product: 'Ultra Milk Cokelat 250ml',
      warehouse: 'Cikarang Central',
      expiryDate: '2026-09-28',
      daysLeft: 19,
      quantity: 340,
      targetChannel: 'Retail Hypermarket Jabodetabek (Fast Moving)',
      status: 'critical',
    },
    {
      id: 2,
      batch: 'BTH-202607-014',
      product: 'Sari Kacang Ijo 250ml',
      warehouse: 'Surabaya Hub',
      expiryDate: '2026-10-04',
      daysLeft: 25,
      quantity: 210,
      targetChannel: 'Modern Trade Jatim & Bali',
      status: 'critical',
    },
    {
      id: 3,
      batch: 'BTH-202608-005',
      product: 'Ultra Milk Full Cream 1000ml',
      warehouse: 'Cikarang Central',
      expiryDate: '2026-10-22',
      daysLeft: 43,
      quantity: 650,
      targetChannel: 'Horeka & Bakery Supply',
      status: 'near_expiry',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner: FEFO Value Impact & Spoilage Prevention Metrics */}
      <div
        className="glass-card"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Metric 1: Spoilage Prevented */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={26} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              POTENSI KERUGIAN DISELAMATKAN (Q3)
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981', lineHeight: 1.2 }}>
              Rp 428.500.000
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Waste Rate turun drastis ke <b>0.3%</b> berkat FEFO
            </div>
          </div>
        </div>

        {/* Metric 2: Average Days to Dispatch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: 'rgba(0, 82, 155, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TrendingUp size={26} color="#00529b" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              RATA-RATA KECEPATAN ROTASI BATCH
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              14.2 Hari
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Batch kritis berhasil keluar <b>18 hari sebelum</b> masa kedaluwarsa
            </div>
          </div>
        </div>

        {/* Metric 3: Warehouse Shelf-Life Health Index */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Zap size={26} color="#8B5CF6" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              SKOR KESEHATAN RATA-RATA STOK
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#8B5CF6', lineHeight: 1.2 }}>
              94.6 / 100
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              98.2% total produk di gudang berstatus <b>Fresh & Safe</b>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: AI Cross-Warehouse Rebalance + Urgent FEFO Dispatch Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px', alignItems: 'stretch' }}>
        {/* Left: Smart Cross-Warehouse Rebalance Recommendations */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#00529b" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Rekomendasi Mutasi Antar Gudang
                </h3>
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>
                Auto-Balance
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Pencegahan penumpukan stok dengan memindahkan batch ke depo dengan perputaran lebih cepat.
            </p>
          </div>

          {/* Action Card 1: Rebalance Cikarang -> Medan */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  Mutasi: Ultra Milk Cokelat 250ml
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Batch <b>BTH-202607-001</b> (19 Hari Lagi). Permintaan Medan melonjak (+45%).
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00529b', backgroundColor: 'rgba(0, 82, 155, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                200 Karton
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Cikarang Central</span>
                <ArrowRight size={14} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Medan Outer Hub</span>
              </div>
              <button
                onClick={handleApplyRebalance}
                disabled={isTransferring}
                className="btn btn-primary"
                style={{ padding: '5px 12px', fontSize: '0.75rem' }}
              >
                <Truck size={13} /> {isTransferring ? 'Memproses...' : 'Jadwalkan Transfer'}
              </button>
            </div>
          </div>

          {/* Action Card 2: Promo Allocation */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                Bundling Promo: Sari Kacang Ijo (210 Karton)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Batch BTH-202607-014 di Surabaya Hub (25 hari lagi) dialokasikan ke Trade Promo Jatim.
              </div>
            </div>
            <button
              onClick={() => showToast('Diskon promo bundling 15% diajukan ke divisi Commercial Sales!', 'info')}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              Setujui Promosi
            </button>
          </div>
        </div>

        {/* Right: Urgent FEFO Dispatch Priority Queue (Batch yang Wajib Keluar Hari Ini) */}
        <div
          className="glass-card"
          style={{
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#EF4444" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Prioritas Pengeluaran Hari Ini (FEFO Urgent Queue)
                </h3>
              </div>
              <span className="badge badge-danger">Wajib OUT Hari Ini</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Daftar batch dengan masa simpan paling kritis yang harus di-*dispatch* ke armada logistik.
            </p>
          </div>

          {/* Urgent Batch List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {urgentQueue.map((item) => {
              const isDispatched = dispatchedQueue.includes(item.id);

              return (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    backgroundColor: isDispatched ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                    border: `1px solid ${isDispatched ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: item.status === 'critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: item.status === 'critical' ? '#EF4444' : '#F59E0B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        flexShrink: 0,
                      }}
                    >
                      #{item.id}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                          {item.product}
                        </span>
                        <span style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: 'var(--primary)' }}>
                          ({item.batch})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.warehouse} • <b>{item.quantity} Karton</b> • Tujuan: {item.targetChannel}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: item.status === 'critical' ? '#EF4444' : '#F59E0B',
                        backgroundColor: item.status === 'critical' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.daysLeft} Hari Lagi
                    </span>

                    {isDispatched ? (
                      <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                        <CheckCircle2 size={12} /> Dispatched
                      </span>
                    ) : (
                      <button
                        onClick={() => handleQuickDispatch(item.id, item.batch)}
                        className="btn btn-primary"
                        style={{ padding: '5px 10px', fontSize: '0.6875rem' }}
                      >
                        <Send size={12} /> DO Keluar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>*Berdasarkan urutan tanggal kedaluwarsa terdekat (FEFO Order)</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total Siap Kirim: 1.200 Karton</span>
          </div>
        </div>
      </div>
    </div>
  );
};
