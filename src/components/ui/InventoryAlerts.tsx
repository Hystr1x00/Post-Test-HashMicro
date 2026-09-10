'use client';

import React, { useState } from 'react';
import { InventoryItem } from '@/types';
import { INVENTORY_FEFO_ITEMS } from '@/data/mockData';
import { useToast } from '@/context/ToastContext';
import { AlertTriangle, Package, Check, RefreshCw, ArrowRight } from 'lucide-react';

export const InventoryAlerts: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_FEFO_ITEMS);
  const [restockingId, setRestockingId] = useState<number | null>(null);

  const handleRestock = (item: InventoryItem) => {
    setRestockingId(item.inventory_id);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.inventory_id === item.inventory_id
            ? {
                ...i,
                quantity: i.quantity + 500,
                expiry_status: 'fresh',
              }
            : i
        )
      );
      setRestockingId(null);
      showToast(
        `Berhasil restock 500 ${item.uom} untuk ${item.product_name}!`,
        'success',
        'Stok Diperbarui'
      );
    }, 600);
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Monitoring Stok Gudang & FEFO Alerts
            </h3>
            <span className="badge badge-warning">
              <AlertTriangle size={12} /> Perlu Perhatian
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Batch dengan status kritis kedaluwarsa & rotasi prioritas
          </p>
        </div>
      </div>

      {/* Inventory Item List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.slice(0, 4).map((item) => {
          const isCritical = item.expiry_status === 'critical';

          return (
            <div
              key={item.inventory_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {/* Product Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Package size={18} color={isCritical ? '#ef4444' : '#3b82f6'} />
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {item.product_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.warehouse_name} • {item.batch_number}
                  </div>
                </div>
              </div>

              {/* Stock Bar */}
              <div style={{ flex: '1', minWidth: '140px', maxWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Stok: {item.quantity} {item.uom}</span>
                  <span style={{ fontWeight: 600, color: isCritical ? '#ef4444' : '#10b981' }}>
                    {item.days_to_expiry}d
                  </span>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(10, item.days_to_expiry))}%`,
                      backgroundColor: isCritical ? '#ef4444' : '#10b981',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRestock(item)}
                disabled={restockingId === item.inventory_id}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                {restockingId === item.inventory_id ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <>
                    <RefreshCw size={13} />
                    <span>Restock +500</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
