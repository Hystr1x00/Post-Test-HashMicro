'use client';

import React, { useState } from 'react';
import { Product, Warehouse, Batch } from '@/types';
import { PRODUCTS, WAREHOUSES, BATCHES } from '@/data/mockData';
import { useToast } from '@/context/ToastContext';
import {
  AlertTriangle,
  ArrowRightLeft,
  Factory,
  Sparkles,
  Building2,
  Package,
  CheckCircle2,
  X,
  Truck,
  ShoppingCart,
  ChevronRight,
  Clock,
} from 'lucide-react';

export interface LowStockAlertItem {
  id: string;
  product_id: number;
  product_name: string;
  sku: string;
  target_warehouse_id: number;
  target_warehouse_name: string;
  current_stock: number;
  min_stock_level: number;
  deficit: number;
  recommended_action: 'TRANSFER' | 'PURCHASE_REQUEST';
  best_source_warehouse?: {
    warehouse_id: number;
    warehouse_name: string;
    surplus_stock: number;
    estimated_delivery_hours: number;
  };
  recommended_qty: number;
}

interface LowStockRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertItem: LowStockAlertItem | null;
  onExecuteTransfer?: (sourceWhId: number, targetWhId: number, prodId: number, qty: number) => void;
  onExecutePurchase?: (targetWhId: number, prodId: number, qty: number) => void;
}

export const LowStockRecommendationModal: React.FC<LowStockRecommendationModalProps> = ({
  isOpen,
  onClose,
  alertItem,
  onExecuteTransfer,
  onExecutePurchase,
}) => {
  const { showToast } = useToast();
  const [activeMode, setActiveMode] = useState<'TRANSFER' | 'PURCHASE_REQUEST'>('TRANSFER');
  const [customQty, setCustomQty] = useState<string>('');
  const [selectedSourceWh, setSelectedSourceWh] = useState<number>(1);

  if (!isOpen || !alertItem) return null;

  const currentQty = customQty ? Number(customQty) : alertItem.recommended_qty;

  const handleConfirmTransfer = () => {
    const sourceWh = WAREHOUSES.find((w) => w.warehouse_id === selectedSourceWh) || WAREHOUSES[0];
    if (onExecuteTransfer) {
      onExecuteTransfer(sourceWh.warehouse_id, alertItem.target_warehouse_id, alertItem.product_id, currentQty);
    }
    showToast(
      `Surat Perintah Transfer (TR-${Date.now().toString().slice(-4)}) diterbitkan: Mengambil ${currentQty} Karton ${alertItem.product_name} dari ${sourceWh.name} ke ${alertItem.target_warehouse_name}!`,
      'success',
      'Transfer Stok Berhasil Dijadwalkan'
    );
    onClose();
  };

  const handleConfirmPurchase = () => {
    if (onExecutePurchase) {
      onExecutePurchase(alertItem.target_warehouse_id, alertItem.product_id, currentQty);
    }
    showToast(
      `Request Order Produksi / PO (GR-${Date.now().toString().slice(-4)}) berhasil diajukan: Pembuatan ${currentQty} Karton ${alertItem.product_name} untuk ${alertItem.target_warehouse_name}!`,
      'success',
      'SPK Produksi / PO Diterbitkan'
    );
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-card"
        style={{
          width: '640px',
          maxWidth: '100%',
          backgroundColor: 'var(--bg-surface)',
          padding: '28px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-danger">
                <AlertTriangle size={12} /> LOW STOCK TRIGGER
              </span>
              <span className="badge badge-primary">
                <Sparkles size={12} /> AI REPLENISHMENT ENGINE
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Rekomendasi Pemulihan Stok: {alertItem.product_name}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Stok di <b>{alertItem.target_warehouse_name}</b> berada di bawah batas minimum pengaman.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Current Deficit Summary Card */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stok On-Hand Saat Ini</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#EF4444', marginTop: '2px' }}>
              {alertItem.current_stock.toLocaleString('id-ID')} Karton
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(239, 68, 68, 0.2)', borderRight: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Batas Minimum (Min Level)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {alertItem.min_stock_level.toLocaleString('id-ID')} Karton
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Defisit Kebutuhan</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
              {alertItem.deficit.toLocaleString('id-ID')} Karton
            </div>
          </div>
        </div>

        {/* Decision Strategy Toggle Cards */}
        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Pilih Jalur Pemenuhan Stok (Auto Recommendation):
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Option 1: Transfer dari Gudang Lain */}
            <div
              onClick={() => setActiveMode('TRANSFER')}
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: activeMode === 'TRANSFER' ? '2px solid #00529b' : '1px solid var(--border-subtle)',
                backgroundColor: activeMode === 'TRANSFER' ? 'rgba(0, 82, 155, 0.08)' : 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                position: 'relative',
              }}
            >
              {alertItem.recommended_action === 'TRANSFER' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    backgroundColor: '#10B981',
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '8px',
                  }}
                >
                  BEST RECOM
                </span>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Truck size={18} color="#00529b" />
                  <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    Ambil dari Gudang Lain
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {alertItem.best_source_warehouse
                    ? `Gudang ${alertItem.best_source_warehouse.warehouse_name.split(' ')[0]} memiliki surplus ${alertItem.best_source_warehouse.surplus_stock} Karton. Estimasi tiba: ${alertItem.best_source_warehouse.estimated_delivery_hours} jam.`
                    : 'Mutasi stok cepat dari depo terdekat tanpa biaya produksi baru.'}
                </p>
              </div>

              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#00529b' }}>
                ✓ Lead Time Cepat • 0 Biaya Tambahan
              </div>
            </div>

            {/* Option 2: Request Order Produksi / PO */}
            <div
              onClick={() => setActiveMode('PURCHASE_REQUEST')}
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: activeMode === 'PURCHASE_REQUEST' ? '2px solid #10B981' : '1px solid var(--border-subtle)',
                backgroundColor: activeMode === 'PURCHASE_REQUEST' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                position: 'relative',
              }}
            >
              {alertItem.recommended_action === 'PURCHASE_REQUEST' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    backgroundColor: '#10B981',
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '8px',
                  }}
                >
                  BEST RECOM
                </span>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Factory size={18} color="#10B981" />
                  <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    Request Beli / Produksi (Inbound)
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  Terbitkan Surat Perintah Kerja (SPK) / Goods Receipt baru langsung ke lini pabrik Tetra Pak atau supplier bahan baku.
                </p>
              </div>

              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#10B981' }}>
                ✓ Batch Fresh 100% • Umur Simpan Maksimal
              </div>
            </div>
          </div>
        </div>

        {/* Action Detail Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeMode === 'TRANSFER' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Gudang Sumber Pengirim (source_warehouse_id)
                </label>
                <select
                  value={selectedSourceWh}
                  onChange={(e) => setSelectedSourceWh(Number(e.target.value))}
                  className="input-control"
                >
                  {WAREHOUSES.filter((w) => w.warehouse_id !== alertItem.target_warehouse_id).map((w) => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>
                      {w.name} ({w.current_stock.toLocaleString('id-ID')} Karton tersedia)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Jumlah Transfer (Karton)
                </label>
                <input
                  type="number"
                  value={customQty || alertItem.recommended_qty}
                  onChange={(e) => setCustomQty(e.target.value)}
                  className="input-control"
                />
              </div>
            </div>
          )}

          {activeMode === 'PURCHASE_REQUEST' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Lini Produksi / Supplier
                </label>
                <input
                  type="text"
                  disabled
                  value="Pabrik Utama Cikarang (Lini Aseptik Tetra Pak A)"
                  className="input-control"
                  style={{ opacity: 0.8 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Volume Produksi Request (Karton)
                </label>
                <input
                  type="number"
                  value={customQty || alertItem.recommended_qty}
                  onChange={(e) => setCustomQty(e.target.value)}
                  className="input-control"
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Batal
          </button>

          {activeMode === 'TRANSFER' ? (
            <button
              onClick={handleConfirmTransfer}
              className="btn btn-primary"
              style={{ backgroundColor: '#00529b' }}
            >
              <ArrowRightLeft size={16} /> Eksekusi Transfer ({currentQty} Karton)
            </button>
          ) : (
            <button
              onClick={handleConfirmPurchase}
              className="btn btn-primary"
              style={{ backgroundColor: '#10B981' }}
            >
              <Factory size={16} /> Terbitkan Request Inbound PO ({currentQty} Karton)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
