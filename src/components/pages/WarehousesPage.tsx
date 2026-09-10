'use client';

import React, { useState } from 'react';
import { WAREHOUSES, INVENTORY_FEFO_ITEMS, PRODUCTS } from '@/data/mockData';
import { Warehouse, InventoryItem } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Building2,
  MapPin,
  Truck,
  Layers,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Calendar,
  Search,
  Send,
  Download,
  Clock,
  X,
  User,
  Package,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const WarehousesPage: React.FC = () => {
  const { showToast } = useToast();
  const [warehouses] = useState<Warehouse[]>(WAREHOUSES);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number>(1); // Default Cikarang
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [fromWh, setFromWh] = useState('WH-CKR-01');
  const [toWh, setToWh] = useState('WH-SBY-02');
  const [transferQty, setTransferQty] = useState('300');
  const [selectedProduct, setSelectedProduct] = useState('Ultra Milk Cokelat 250ml');
  const [searchTerm, setSearchTerm] = useState('');

  const activeWarehouse = warehouses.find((w) => w.warehouse_id === selectedWarehouseId) || warehouses[0];

  // Get items in the selected warehouse
  const warehouseItems: InventoryItem[] = INVENTORY_FEFO_ITEMS.filter(
    (item) => item.warehouse_code === activeWarehouse.code
  );

  const filteredItems = warehouseItems.filter(
    (item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      `Surat Perintah Transfer (TR-2026-904) berhasil diterbitkan: ${transferQty} Karton ${selectedProduct} dari ${fromWh} ke ${toWh}!`,
      'success',
      'Transfer Dijadwalkan'
    );
    setIsTransferModalOpen(false);
  };

  const getStatusBadge = (status: string, days: number) => {
    switch (status) {
      case 'critical':
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} /> {days} Hari (Kritis FEFO)
          </span>
        );
      case 'near_expiry':
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> {days} Hari Lagi
          </span>
        );
      default:
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={12} /> {days} Hari (Fresh)
          </span>
        );
    }
  };

  // Warehouse Head PIC lookup
  const getWarehouseManager = (code: string) => {
    switch (code) {
      case 'WH-CKR-01':
        return { name: 'Hendro Wijaya', role: 'Head of Central Plant Warehouse', phone: '+62 812-3456-7890' };
      case 'WH-SBY-02':
        return { name: 'Bambang Sudiro', role: 'Surabaya Hub Supervisor', phone: '+62 813-9876-5432' };
      case 'WH-BDG-03':
        return { name: 'Asep Ridwan', role: 'Bandung Depo Supervisor', phone: '+62 817-5555-1234' };
      default:
        return { name: 'Zulham Efendi', role: 'Medan Hub Manager', phone: '+62 811-2233-4455' };
    }
  };

  const manager = getWarehouseManager(activeWarehouse?.code || 'WH-CKR-01');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} color="#00529b" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Manajemen Multi-Warehouse & Rincian Stok Fisik
            </h2>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Klik pada salah satu kartu gudang di bawah untuk menginspeksi isi produk, nomor batch, dan tanggal kedaluwarsa secara mendalam.
          </p>
        </div>

        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="btn btn-primary"
          style={{ backgroundColor: '#00529b' }}
        >
          <ArrowRightLeft size={16} /> Transfer Antar Gudang
        </button>
      </div>

      {/* Warehouse Cards Grid (Clickable) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {warehouses.map((wh) => {
          const isSelected = wh.warehouse_id === selectedWarehouseId;
          const occupancyRate = Math.round((wh.current_stock / wh.capacity) * 100);
          const batchesInWh = INVENTORY_FEFO_ITEMS.filter((i) => i.warehouse_code === wh.code);
          const criticalBatches = batchesInWh.filter((i) => i.expiry_status === 'critical').length;

          return (
            <div
              key={wh.warehouse_id}
              onClick={() => setSelectedWarehouseId(wh.warehouse_id)}
              className="glass-card"
              style={{
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                cursor: 'pointer',
                border: isSelected ? `2px solid #00529b` : '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                boxShadow: 'none',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        backgroundColor: `${wh.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Building2 size={18} color={wh.color} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {wh.name}
                      </h3>
                      <span style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: wh.color, fontWeight: 700 }}>
                        {wh.code}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="badge badge-info" style={{ backgroundColor: '#00529b', color: '#fff', fontSize: '0.625rem' }}>
                      Terpilih
                    </span>
                  )}
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                  <MapPin size={13} color="var(--text-muted)" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wh.location}</span>
                </div>

                {/* Capacity Progress Bar */}
                <div style={{ marginTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Kapasitas Terpakai</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      {wh.current_stock.toLocaleString('id-ID')} / {wh.capacity.toLocaleString('id-ID')} Karton ({occupancyRate}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${occupancyRate}%`,
                        height: '100%',
                        backgroundColor: occupancyRate > 80 ? '#EF4444' : wh.color,
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status footer pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.6875rem' }}>
                <span style={{ color: criticalBatches > 0 ? '#EF4444' : 'var(--text-muted)', fontWeight: 700 }}>
                  {criticalBatches > 0 ? `🚨 ${criticalBatches} Batch Kritis` : '✅ Semua Batch Aman'}
                </span>
                <span style={{ color: '#00529b', fontWeight: 700 }}>
                  {batchesInWh.length} SKU Batch →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED WAREHOUSE INVENTORY BREAKDOWN (MUNJUL KETIKA DIKLIK) */}
      <div
        className="glass-card animate-fade-in"
        style={{
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Selected Warehouse Summary Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  backgroundColor: activeWarehouse.color,
                  padding: '3px 10px',
                  borderRadius: '12px',
                }}
              >
                {activeWarehouse.code}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Rincian Isi Stok & Batch: {activeWarehouse.name}
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              📍 {activeWarehouse.location} • 👤 Kepala Gudang: <b>{manager.name}</b> ({manager.role})
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px 14px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Total Batch di Gudang</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {warehouseItems.length} Batch
              </div>
            </div>
            <div style={{ padding: '8px 14px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Volume Stok Fisik</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00529b' }}>
                {activeWarehouse.current_stock.toLocaleString('id-ID')} Karton
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter within this warehouse */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari SKU, Batch, Produk di gudang ini..."
              className="input-control"
              style={{ paddingLeft: '38px', height: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                showToast(`Data stok fisik ${activeWarehouse.name} berhasil diexport ke CSV.`, 'info');
              }}
              className="btn btn-secondary"
            >
              <Download size={14} /> Export Data Gudang Ini
            </button>
            <button
              onClick={() => {
                setIsTransferModalOpen(true);
                setFromWh(activeWarehouse?.code || 'WH-CKR-01');
              }}
              className="btn btn-primary"
              style={{ backgroundColor: '#00529b' }}
            >
              <ArrowRightLeft size={14} /> Transfer Stok Keluar
            </button>
          </div>
        </div>

        {/* Detailed Inventory Items Table in this Warehouse */}
        <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>KODE SKU & BATCH</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>NAMA PRODUK</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>KATEGORI</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>TGL PRODUKSI</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>TGL KEDALUWARSA</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>STATUS UMUR SIMPAN</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>STOK ON-HAND</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Tidak ada batch produk yang ditemukan di gudang ini.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.inventory_id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#00529b', fontFamily: 'monospace' }}>
                        {item.batch_number}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.sku}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.product_name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                        {item.category_name}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {item.production_date}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.expiry_date}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {getStatusBadge(item.expiry_status, item.days_to_expiry)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {item.quantity.toLocaleString('id-ID')} Karton
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          showToast(`Surat Jalan FEFO diterbitkan untuk ${item.product_name} (${item.batch_number}) dari ${activeWarehouse.name}`, 'success', 'DO Diterbitkan');
                        }}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.6875rem', backgroundColor: item.expiry_status === 'critical' ? '#EF4444' : '#00529b' }}
                      >
                        <Send size={11} /> Dispatch
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTransferModalOpen(false)}>
          <div
            className="glass-card"
            style={{
              width: '500px',
              maxWidth: '100%',
              backgroundColor: 'var(--bg-surface)',
              padding: '24px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Surat Perintah Transfer Antar Gudang</h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Gudang Asal
                  </label>
                  <select value={fromWh} onChange={(e) => setFromWh(e.target.value)} className="input-control">
                    <option value="WH-CKR-01">Cikarang Central</option>
                    <option value="WH-SBY-02">Surabaya Hub</option>
                    <option value="WH-BDG-03">Bandung Depo</option>
                    <option value="WH-MDN-04">Medan Transit</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Gudang Tujuan
                  </label>
                  <select value={toWh} onChange={(e) => setToWh(e.target.value)} className="input-control">
                    <option value="WH-SBY-02">Surabaya Hub</option>
                    <option value="WH-MDN-04">Medan Transit</option>
                    <option value="WH-BDG-03">Bandung Depo</option>
                    <option value="WH-CKR-01">Cikarang Central</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Pilih Produk & Batch
                </label>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="input-control">
                  <option value="Ultra Milk Cokelat 250ml">Ultra Milk Cokelat 250ml (BTH-202607-001 - Expiry 28 Sep 2026)</option>
                  <option value="Ultra Milk Full Cream 1000ml">Ultra Milk Full Cream 1000ml (BTH-202608-005 - Expiry 22 Okt 2026)</option>
                  <option value="Teh Kotak Jasmine 300ml">Teh Kotak Jasmine 300ml (BTH-202608-019 - Expiry 05 Nov 2026)</option>
                  <option value="Sari Kacang Ijo 250ml">Sari Kacang Ijo 250ml (BTH-202607-014 - Expiry 04 Okt 2026)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Jumlah Karton yang Dipindahkan
                </label>
                <input
                  type="number"
                  value={transferQty}
                  onChange={(e) => setTransferQty(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#00529b' }}>
                  Terbitkan Surat Jalan Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
