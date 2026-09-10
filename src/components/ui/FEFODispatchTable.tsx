'use client';

import React, { useState, useMemo } from 'react';
import { InventoryItem } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  ArrowRightLeft,
  X,
  Building,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FEFODispatchTableProps {
  items: InventoryItem[];
  onDispatchSuccess: (inventoryId: number, dispatchedQty: number) => void;
}

export const FEFODispatchTable: React.FC<FEFODispatchTableProps> = ({ items, onDispatchSuccess }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [dispatchQty, setDispatchQty] = useState<number>(100);

  // Filter and search
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchWh = warehouseFilter === 'all' || item.warehouse_code === warehouseFilter;
        const matchStatus = statusFilter === 'all' || item.expiry_status === statusFilter;
        const matchSearch =
          item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchWh && matchStatus && matchSearch;
      })
      .sort((a, b) => a.days_to_expiry - b.days_to_expiry); // FEFO Order: Earliest expiry on top!
  }, [items, warehouseFilter, statusFilter, searchTerm]);

  // Handle Dispatch confirmation
  const handleConfirmDispatch = () => {
    if (!selectedItem) return;
    if (dispatchQty <= 0 || dispatchQty > selectedItem.quantity) {
      showToast('Kuantitas dispatch tidak valid atau melebihi stok tersedia.', 'warning', 'Validasi Gagal');
      return;
    }

    onDispatchSuccess(selectedItem.inventory_id, dispatchQty);
    showToast(
      `Berhasil dispatch ${dispatchQty} ${selectedItem.uom} dari batch ${selectedItem.batch_number} (FEFO Priority)!`,
      'success',
      'FEFO Dispatch Selesai'
    );
    setSelectedItem(null);
  };

  const getStatusBadge = (status: string, days: number) => {
    switch (status) {
      case 'critical':
        return (
          <span className="badge badge-danger" style={{ fontWeight: 700 }}>
            <AlertTriangle size={12} /> {days} Hari Lagi (Kritis)
          </span>
        );
      case 'near_expiry':
        return (
          <span className="badge badge-warning" style={{ fontWeight: 700 }}>
            <Clock size={12} /> {days} Hari Lagi
          </span>
        );
      default:
        return (
          <span className="badge badge-success" style={{ fontWeight: 700 }}>
            <CheckCircle2 size={12} /> {days} Hari (Fresh)
          </span>
        );
    }
  };

  return (
    <div className="glass-card" style={{ borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              FEFO Priority Stock Dispatch & Traceability
            </h3>
            <span
              style={{
                backgroundColor: 'rgba(0, 82, 155, 0.15)',
                color: '#00529b',
                fontSize: '0.6875rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} /> FEFO Otomatis (First Expiry, First Out)
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Batch dengan tanggal kedaluwarsa terdekat otomatis ditempatkan di prioritas teratas untuk mencegah *spoilage/waste*.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              showToast('Laporan audit batch & tanggal kedaluwarsa berhasil diexport!', 'info', 'Export CSV');
            }}
            className="btn btn-secondary"
          >
            <Download size={15} /> Export Audit Log
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari SKU, Batch, Produk, Gudang..."
            className="input-control"
            style={{ paddingLeft: '38px', height: '38px' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Warehouse selector */}
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="input-control"
            style={{ width: '190px', height: '38px', cursor: 'pointer' }}
          >
            <option value="all">Semua Gudang (Multi-WH)</option>
            <option value="WH-CKR-01">Cikarang Central</option>
            <option value="WH-SBY-02">Surabaya Hub</option>
            <option value="WH-BDG-03">Bandung Depo</option>
            <option value="WH-MDN-04">Medan Transit</option>
          </select>

          {/* Expiry Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-control"
            style={{ width: '170px', height: '38px', cursor: 'pointer' }}
          >
            <option value="all">Semua Status Expiry</option>
            <option value="critical">🚨 Kritis (&lt;30 Hari)</option>
            <option value="near_expiry">⚠️ Dekat Expiry (30-60d)</option>
            <option value="fresh">✅ Fresh (&gt;60 Hari)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>PRIORITAS FEFO</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>NO. BATCH & SKU</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>NAMA PRODUK</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>LOKASI GUDANG</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>TGL KEDALUWARSA</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>SISA MASA SIMPAN</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>STOK ON-HAND</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>AKSI DISPATCH</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Tidak ada batch yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const isTopPriority = idx === 0 && item.expiry_status === 'critical';

                return (
                  <tr
                    key={item.inventory_id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: isTopPriority ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isTopPriority ? 'rgba(239, 68, 68, 0.04)' : 'transparent')}
                  >
                    {/* FEFO Priority Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: idx === 0 ? '#00529b' : 'var(--bg-surface-elevated)',
                          color: idx === 0 ? '#ffffff' : 'var(--text-secondary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        #{idx + 1}
                      </span>
                    </td>

                    {/* Batch Number & SKU */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                        {item.batch_number}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.sku}</div>
                    </td>

                    {/* Product */}
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.product_name}
                    </td>

                    {/* Warehouse */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={14} color="var(--primary)" />
                        <span>{item.warehouse_name}</span>
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        <span>{item.expiry_date}</span>
                      </div>
                    </td>

                    {/* Remaining shelf life badge */}
                    <td style={{ padding: '14px 16px' }}>
                      {getStatusBadge(item.expiry_status, item.days_to_expiry)}
                    </td>

                    {/* Stock On-Hand */}
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {item.quantity.toLocaleString('id-ID')} Karton
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setDispatchQty(Math.min(100, item.quantity));
                        }}
                        className="btn"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          backgroundColor: idx === 0 ? '#00529b' : 'var(--bg-surface-elevated)',
                          color: idx === 0 ? '#ffffff' : 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <Send size={12} /> Dispatch Out
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FEFO Dispatch Confirmation Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div
            className="glass-card"
            style={{
              width: '480px',
              maxWidth: '100%',
              backgroundColor: 'var(--bg-surface)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              borderRadius: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00529b' }}>
                  FEFO STOCK OUT DISPATCH
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Keluarkan Stok via FEFO
                </h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '12px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedItem.product_name}</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Batch: <b>{selectedItem.batch_number}</b> • Expiry: <b>{selectedItem.expiry_date}</b> ({selectedItem.days_to_expiry} Hari Lagi)
                </div>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Lokasi: {selectedItem.warehouse_name} • Sisa Stok: {selectedItem.quantity} Karton
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Kuantitas Karton yang Dikeluarkan (Maks: {selectedItem.quantity})
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedItem.quantity}
                  value={dispatchQty}
                  onChange={(e) => setDispatchQty(Number(e.target.value))}
                  className="input-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Tujuan Pengiriman / Alasan
                </label>
                <input
                  type="text"
                  defaultValue="Distribusi Retail Jabodetabek (Sales Order SO-8902)"
                  className="input-control"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button onClick={() => setSelectedItem(null)} className="btn btn-secondary">
                Batal
              </button>
              <button onClick={handleConfirmDispatch} className="btn btn-primary" style={{ backgroundColor: '#00529b' }}>
                <CheckCircle2 size={16} /> Konfirmasi FEFO Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
