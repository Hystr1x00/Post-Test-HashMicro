'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import {
  Bell,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Factory,
  Sparkles,
  Truck,
  CheckCircle2,
  X,
  ChevronRight,
  Layers,
  Building2,
  Package,
} from 'lucide-react';
import { LowStockAlertItem, LowStockRecommendationModal } from './LowStockRecommendationModal';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'low_stock' | 'fefo'>('low_stock');
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<LowStockAlertItem | null>(null);

  // Dynamic Low Stock Alerts with Auto-Recommendations
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlertItem[]>([
    {
      id: 'ls-1',
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
      id: 'ls-2',
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
      id: 'ls-3',
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

  // FEFO Expiry Alerts
  const fefoAlerts = [
    {
      id: 'fefo-1',
      batch_no: 'BTH-202607-001',
      product_name: 'Ultra Milk Cokelat 250ml',
      warehouse_name: 'Cikarang Central Plant Warehouse',
      days_to_expiry: 18,
      status: 'critical',
      quantity: 340,
    },
    {
      id: 'fefo-2',
      batch_no: 'BTH-202607-014',
      product_name: 'Sari Kacang Ijo 250ml',
      warehouse_name: 'Surabaya Distribution Hub',
      days_to_expiry: 24,
      status: 'critical',
      quantity: 210,
    },
    {
      id: 'fefo-3',
      batch_no: 'BTH-202608-005',
      product_name: 'Ultra Milk Full Cream 1000ml',
      warehouse_name: 'Cikarang Central Plant Warehouse',
      days_to_expiry: 42,
      status: 'near_expiry',
      quantity: 650,
    },
  ];

  if (!isOpen) return null;

  const handleExecuteQuickTransfer = (alert: LowStockAlertItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const sourceName = alert.best_source_warehouse?.warehouse_name || 'Gudang Cikarang';
    showToast(
      `Perintah Transfer Otomatis (TR-${Math.floor(1000 + Math.random() * 9000)}) berhasil dibuat: Mengambil ${alert.recommended_qty} Karton dari ${sourceName} ke ${alert.target_warehouse_name}!`,
      'success',
      'Transfer Auto-Executed'
    );
    setLowStockAlerts((prev) => prev.filter((item) => item.id !== alert.id));
  };

  const handleExecuteQuickPurchase = (alert: LowStockAlertItem, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(
      `Purchase Request / SPK Produksi (GR-${Math.floor(1000 + Math.random() * 9000)}) untuk ${alert.recommended_qty} Karton ${alert.product_name} berhasil diterbitkan ke Lini Pabrik!`,
      'success',
      'Inbound PO Diterbitkan'
    );
    setLowStockAlerts((prev) => prev.filter((item) => item.id !== alert.id));
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,
        }}
        onClick={onClose}
      />

      <div
        className="glass-card"
        style={{
          position: 'absolute',
          top: '70px',
          right: '32px',
          width: '440px',
          maxWidth: 'calc(100vw - 40px)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 120,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          animation: 'fadeIn 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={16} color="#EF4444" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Pusat Peringatan & Auto-Recomm
              </h4>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Monitoring Ambang Batas Stok & FEFO
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '3px',
            borderRadius: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('low_stock')}
            style={{
              flex: 1,
              padding: '6px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeTab === 'low_stock' ? '#00529b' : 'transparent',
              color: activeTab === 'low_stock' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <AlertTriangle size={13} />
            <span>Low Stock Alert ({lowStockAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fefo')}
            style={{
              flex: 1,
              padding: '6px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeTab === 'fefo' ? '#00529b' : 'transparent',
              color: activeTab === 'fefo' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Clock size={13} />
            <span>FEFO Expiry ({fefoAlerts.length})</span>
          </button>
        </div>

        {/* Content Tab 1: Low Stock & Auto-Recomm */}
        {activeTab === 'low_stock' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
            {lowStockAlerts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                <CheckCircle2 size={24} color="#10B981" style={{ margin: '0 auto 8px' }} />
                Semua stok produk di seluruh gudang berada di atas batas aman.
              </div>
            ) : (
              lowStockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                        {alert.product_name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#EF4444', fontWeight: 600, marginTop: '2px' }}>
                        📍 {alert.target_warehouse_name.split(' ')[0]}: Sisa {alert.current_stock} / Min {alert.min_stock_level} Karton
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        backgroundColor: alert.recommended_action === 'TRANSFER' ? 'rgba(0, 82, 155, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: alert.recommended_action === 'TRANSFER' ? '#00529b' : '#10B981',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Sparkles size={10} />
                      {alert.recommended_action === 'TRANSFER' ? 'Transfer Recom' : 'PO Recom'}
                    </span>
                  </div>

                  {/* Recommendation message */}
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-surface)',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      lineHeight: 1.3,
                    }}
                  >
                    {alert.recommended_action === 'TRANSFER' ? (
                      <div>
                        🚚 <b>Rekomendasi Ambil Gudang:</b> Surplus {alert.best_source_warehouse?.surplus_stock} Karton di {alert.best_source_warehouse?.warehouse_name.split(' ')[0]}.
                      </div>
                    ) : (
                      <div>
                        🏭 <b>Rekomendasi Beli/Produksi:</b> Stok menipis secara nasional. Buat SPK Produksi Inbound baru.
                      </div>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    {alert.recommended_action === 'TRANSFER' ? (
                      <button
                        onClick={(e) => handleExecuteQuickTransfer(alert, e)}
                        className="btn"
                        style={{
                          flex: 1,
                          backgroundColor: '#00529b',
                          color: '#ffffff',
                          padding: '6px 10px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                        }}
                      >
                        <ArrowRightLeft size={12} /> Ambil dari {alert.best_source_warehouse?.warehouse_name.split(' ')[0]} ({alert.recommended_qty} Ktn)
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleExecuteQuickPurchase(alert, e)}
                        className="btn"
                        style={{
                          flex: 1,
                          backgroundColor: '#10B981',
                          color: '#ffffff',
                          padding: '6px 10px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                        }}
                      >
                        <Factory size={12} /> Request Inbound PO ({alert.recommended_qty} Ktn)
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedAlertForModal(alert)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 8px', fontSize: '0.6875rem', borderRadius: '8px' }}
                      title="Lihat Opsi Lengkap"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Content Tab 2: FEFO Expiry Alerts */}
        {activeTab === 'fefo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
            {fefoAlerts.map((fefo) => (
              <div
                key={fefo.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {fefo.product_name}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Batch: {fefo.batch_no} • {fefo.warehouse_name.split(' ')[0]}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    className={`badge ${fefo.status === 'critical' ? 'badge-danger' : 'badge-warning'}`}
                    style={{ fontSize: '0.6875rem', fontWeight: 800 }}
                  >
                    {fefo.days_to_expiry} Hari Lagi
                  </span>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Stok: {fefo.quantity} Karton
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('outbound');
                onClose();
              }}
              className="btn btn-primary"
              style={{ width: '100%', backgroundColor: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}
            >
              Buka Modul Outbound FEFO Dispatch →
            </button>
          </div>
        )}
      </div>

      {/* Low Stock Recommendation Analysis Modal */}
      {selectedAlertForModal && (
        <LowStockRecommendationModal
          isOpen={!!selectedAlertForModal}
          onClose={() => setSelectedAlertForModal(null)}
          alertItem={selectedAlertForModal}
          onExecuteTransfer={(sourceWhId, targetWhId, prodId, qty) => {
            setLowStockAlerts((prev) => prev.filter((item) => item.id !== selectedAlertForModal.id));
          }}
          onExecutePurchase={(targetWhId, prodId, qty) => {
            setLowStockAlerts((prev) => prev.filter((item) => item.id !== selectedAlertForModal.id));
          }}
        />
      )}
    </>
  );
};
