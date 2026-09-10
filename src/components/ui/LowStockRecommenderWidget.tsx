'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import {
  AlertTriangle,
  ArrowRightLeft,
  Factory,
  Sparkles,
  Truck,
  Building2,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { LowStockAlertItem, LowStockRecommendationModal } from './LowStockRecommendationModal';

export const LowStockRecommenderWidget: React.FC = () => {
  const { showToast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<LowStockAlertItem | null>(null);

  const [alerts, setAlerts] = useState<LowStockAlertItem[]>([
    {
      id: 'ls-w1',
      product_id: 104,
      product_name: 'Sari Kacang Ijo 250ml',
      sku: 'SKI-ORI-250',
      target_warehouse_id: 2,
      target_warehouse_name: 'Surabaya Distribution Hub',
      current_stock: 210,
      min_stock_level: 400,
      deficit: 190,
      recommended_action: 'TRANSFER',
      best_source_warehouse: {
        warehouse_id: 1,
        warehouse_name: 'Cikarang Central Plant Warehouse',
        surplus_stock: 1470,
        estimated_delivery_hours: 10,
      },
      recommended_qty: 300,
    },
    {
      id: 'ls-w2',
      product_id: 103,
      product_name: 'Teh Kotak Jasmine 300ml',
      sku: 'TK-JAS-300',
      target_warehouse_id: 4,
      target_warehouse_name: 'Medan Outer Transit Hub',
      current_stock: 450,
      min_stock_level: 600,
      deficit: 150,
      recommended_action: 'TRANSFER',
      best_source_warehouse: {
        warehouse_id: 1,
        warehouse_name: 'Cikarang Central Plant Warehouse',
        surplus_stock: 1200,
        estimated_delivery_hours: 24,
      },
      recommended_qty: 400,
    },
    {
      id: 'ls-w3',
      product_id: 106,
      product_name: 'Ultra Milk Strawberry 250ml',
      sku: 'UM-ST-250',
      target_warehouse_id: 3,
      target_warehouse_name: 'Bandung Regional Depo',
      current_stock: 520,
      min_stock_level: 500,
      deficit: 480,
      recommended_action: 'PURCHASE_REQUEST',
      recommended_qty: 1000,
    },
  ]);

  const handleQuickTransfer = (item: LowStockAlertItem) => {
    const sourceName = item.best_source_warehouse?.warehouse_name || 'Gudang Cikarang';
    showToast(
      `Perintah Transfer Antar-Gudang (TR-${Math.floor(1000 + Math.random() * 9000)}) berhasil dibuat: Mengambil ${item.recommended_qty} Karton ${item.product_name} dari ${sourceName.split(' ')[0]} ke ${item.target_warehouse_name.split(' ')[0]}!`,
      'success',
      'Transfer Berhasil Dieksekusi'
    );
    setAlerts((prev) => prev.filter((a) => a.id !== item.id));
  };

  const handleQuickPurchase = (item: LowStockAlertItem) => {
    showToast(
      `Purchase Request / SPK Produksi (GR-${Math.floor(1000 + Math.random() * 9000)}) untuk ${item.recommended_qty} Karton ${item.product_name} diterbitkan ke Lini Pabrik Utama!`,
      'success',
      'Request Inbound PO Dibuat'
    );
    setAlerts((prev) => prev.filter((a) => a.id !== item.id));
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="glass-card"
        style={{
          borderRadius: '16px',
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} color="#EF4444" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Peringatan Stok Rendah & Rekomendasi Alokasi
                </h3>
                <span className="badge badge-danger" style={{ fontSize: '0.6875rem' }}>
                  {alerts.length} SKU Menipis
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Sistem secara otomatis menganalisis ketersediaan stok surplus di gudang lain vs pengajuan pesanan pembelian (PO).
              </p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {alerts.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: '#00529b', fontWeight: 700 }}>
                      {item.sku}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {item.product_name}
                    </h4>
                  </div>

                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: item.recommended_action === 'TRANSFER' ? 'rgba(0, 82, 155, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                      color: item.recommended_action === 'TRANSFER' ? '#00529b' : '#10B981',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={11} />
                    {item.recommended_action === 'TRANSFER' ? 'Rekomendasi Ambil Gudang' : 'Rekomendasi Request PO'}
                  </span>
                </div>

                {/* Stock bar comparison */}
                <div
                  style={{
                    margin: '10px 0',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>
                    📍 <b>{item.target_warehouse_name.split(' ')[0]}</b>:
                  </span>
                  <span style={{ fontWeight: 800, color: '#EF4444' }}>
                    Stok {item.current_stock} / Min {item.min_stock_level} Karton
                  </span>
                </div>

                {/* Recommendation explanation */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {item.recommended_action === 'TRANSFER' ? (
                    <div>
                      🚚 <b>Ambil dari Gudang {item.best_source_warehouse?.warehouse_name.split(' ')[0]}:</b> Tersedia surplus {item.best_source_warehouse?.surplus_stock} Karton. Estimasi pengiriman armada truk ~{item.best_source_warehouse?.estimated_delivery_hours} jam.
                    </div>
                  ) : (
                    <div>
                      🏭 <b>Request Produksi / Inbound PO:</b> Stok menipis secara regional. Disarankan mengajukan SPK produksi {item.recommended_qty} Karton ke Pabrik Utama.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {item.recommended_action === 'TRANSFER' ? (
                  <button
                    onClick={() => handleQuickTransfer(item)}
                    className="btn btn-primary"
                    style={{ flex: 1, backgroundColor: '#00529b', padding: '8px 12px', fontSize: '0.75rem' }}
                  >
                    <ArrowRightLeft size={13} /> Eksekusi Transfer ({item.recommended_qty} Ktn)
                  </button>
                ) : (
                  <button
                    onClick={() => handleQuickPurchase(item)}
                    className="btn btn-primary"
                    style={{ flex: 1, backgroundColor: '#10B981', padding: '8px 12px', fontSize: '0.75rem' }}
                  >
                    <Factory size={13} /> Request Inbound PO ({item.recommended_qty} Ktn)
                  </button>
                )}

                <button
                  onClick={() => setSelectedAlert(item)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.75rem' }}
                  title="Lihat Pilihan Lengkap"
                >
                  Opsi Lain →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedAlert && (
        <LowStockRecommendationModal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          alertItem={selectedAlert}
          onExecuteTransfer={() => {
            setAlerts((prev) => prev.filter((a) => a.id !== selectedAlert.id));
          }}
          onExecutePurchase={() => {
            setAlerts((prev) => prev.filter((a) => a.id !== selectedAlert.id));
          }}
        />
      )}
    </>
  );
};
