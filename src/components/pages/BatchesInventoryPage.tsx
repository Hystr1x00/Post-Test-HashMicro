'use client';

import React, { useState } from 'react';
import { BATCHES, INVENTORY, PRODUCTS, WAREHOUSES, buildInventoryFefoItems } from '@/data/mockData';
import { Batch, Inventory, InventoryItem, Product } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Layers,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  Package,
  Calendar,
  Zap,
  ArrowRightLeft,
  X,
} from 'lucide-react';
import { LowStockRecommenderWidget } from '@/components/ui/LowStockRecommenderWidget';

export const BatchesInventoryPage: React.FC = () => {
  const { showToast } = useToast();
  const [batchesList, setBatchesList] = useState<Batch[]>(BATCHES);
  const [inventoryList, setInventoryList] = useState<Inventory[]>(INVENTORY);
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'batches'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);

  // New Batch Form States
  const [batchProductId, setBatchProductId] = useState<number>(101);
  const [newBatchNo, setNewBatchNo] = useState(`BTH-${new Date().toISOString().slice(0, 7).replace('-', '')}-099`);
  const [newProdDate, setNewProdDate] = useState(new Date().toISOString().slice(0, 10));
  const [newExpDate, setNewExpDate] = useState('2027-05-30');

  // Joined inventory items
  const inventoryItems: InventoryItem[] = buildInventoryFefoItems(
    inventoryList,
    batchesList,
    PRODUCTS,
    WAREHOUSES
  );

  const filteredInventory = inventoryItems.filter((i) => {
    const matchWh = warehouseFilter === 'all' || i.warehouse_id.toString() === warehouseFilter;
    const matchStatus = statusFilter === 'all' || i.expiry_status === statusFilter;
    const matchSearch =
      i.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchWh && matchStatus && matchSearch;
  });

  const filteredBatches = batchesList.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch =
      b.batch_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.product_name && b.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    // Check unique constraint (product_id, batch_no)
    const exists = batchesList.some(
      (b) => b.product_id === batchProductId && b.batch_no.toLowerCase() === newBatchNo.toLowerCase()
    );
    if (exists) {
      showToast(`Batch ${newBatchNo} sudah terdaftar untuk produk ini! ERD constraint: UNIQUE(product_id, batch_no)`, 'danger', 'Gagal Validasi Unique');
      return;
    }

    const prod = PRODUCTS.find((p) => p.product_id === batchProductId);
    const newBatch: Batch = {
      batch_id: Date.now(),
      product_id: batchProductId,
      product_name: prod?.name,
      batch_no: newBatchNo,
      production_date: newProdDate,
      expiry_date: newExpDate,
      status: 'fresh',
      uom: prod?.uom,
      days_to_expiry: 180,
    };

    setBatchesList([newBatch, ...batchesList]);
    showToast(`Batch ${newBatchNo} untuk ${prod?.name} berhasil didaftarkan ke Master Batches!`, 'success');
    setIsAddBatchModalOpen(false);
  };

  const getStatusBadge = (status: string, days?: number) => {
    switch (status) {
      case 'critical':
        return (
          <span className="badge badge-danger" style={{ fontWeight: 700 }}>
            <AlertTriangle size={12} /> {days ? `${days} Hari (Kritis FEFO)` : 'Kritis'}
          </span>
        );
      case 'near_expiry':
        return (
          <span className="badge badge-warning" style={{ fontWeight: 700 }}>
            <Clock size={12} /> {days ? `${days} Hari Lagi` : 'Mendekati Expired'}
          </span>
        );
      default:
        return (
          <span className="badge badge-success" style={{ fontWeight: 700 }}>
            <CheckCircle2 size={12} /> {days ? `${days} Hari (Fresh)` : 'Fresh'}
          </span>
        );
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
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
            <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
              <Layers size={12} /> CORE ERD: inventory & batches
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • Matriks Stok Per Gudang & Pelacakan Siklus Umur Batch (FEFO)
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Inventory & Batches Master Hub
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Relasi <code>inventory</code> (warehouse_id, batch_id, quantity) dan <code>batches</code> (product_id, batch_no, expiry_date, status) untuk menjamin rotasi FEFO tanpa waste.
          </p>
        </div>

        <button
          onClick={() => setIsAddBatchModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Registrasi Batch Baru
        </button>
      </div>

      {/* AI Low Stock Alert & Smart Replenishment Auto-Recommender Widget */}
      <LowStockRecommenderWidget />

      {/* Sub Tabs Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveSubTab('inventory')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              background: activeSubTab === 'inventory' ? 'linear-gradient(135deg, #00529b 0%, #0077c8 100%)' : 'transparent',
              color: activeSubTab === 'inventory' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Matriks Stok Gudang (inventory)
          </button>
          <button
            onClick={() => setActiveSubTab('batches')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              background: activeSubTab === 'batches' ? 'linear-gradient(135deg, #00529b 0%, #0077c8 100%)' : 'transparent',
              color: activeSubTab === 'batches' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Master Batch Produksi (batches)
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Batch, Produk, SKU..."
              className="input-control"
              style={{ paddingLeft: '38px', height: '38px' }}
            />
          </div>

          {activeSubTab === 'inventory' && (
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="input-control"
              style={{ width: 'auto', height: '38px' }}
            >
              <option value="all">Semua Gudang</option>
              {WAREHOUSES.map((w) => (
                <option key={w.warehouse_id} value={w.warehouse_id.toString()}>
                  {w.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-control"
            style={{ width: 'auto', height: '38px' }}
          >
            <option value="all">Semua Status FEFO</option>
            <option value="critical">Kritis (&le; 30 Hari)</option>
            <option value="near_expiry">Mendekati Expired (&le; 60 Hari)</option>
            <option value="fresh">Fresh (&gt; 60 Hari)</option>
          </select>
        </div>
      </div>

      {/* SubTab 1: Inventory Table (Warehouse x Batch x Qty) */}
      {activeSubTab === 'inventory' && (
        <div className="glass-card" style={{ borderRadius: '24px', padding: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>PRIORITAS FEFO</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>PRODUK & KODE SKU</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>NOMOR BATCH</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>LOKASI GUDANG (warehouse_id)</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>STOK ON-HAND</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>TGL KEDALUWARSA</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>STATUS FEFO</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr
                  key={item.inventory_id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: item.fefo_priority === 1 ? '#EF4444' : item.fefo_priority === 2 ? '#F59E0B' : '#00529b',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}
                    >
                      #{item.fefo_priority}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.product_name}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.sku} • {item.category_name}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#0077c8' }}>
                    {item.batch_number}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.warehouse_name}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.warehouse_code}</div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.quantity.toLocaleString('id-ID')} {item.uom}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    <div>{item.expiry_date}</div>
                    <div style={{ fontSize: '0.6875rem' }}>Prod: {item.production_date}</div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {getStatusBadge(item.expiry_status, item.days_to_expiry)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SubTab 2: Batches Master Table */}
      {activeSubTab === 'batches' && (
        <div className="glass-card" style={{ borderRadius: '24px', padding: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>BATCH ID (PK)</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>NOMOR BATCH (batch_no)</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>PRODUK TERKAIT (product_id FK)</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>TANGGAL PRODUKSI</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>TANGGAL EXPIRED</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>STATUS KUALITAS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((b) => (
                <tr
                  key={b.batch_id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    #{b.batch_id}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0077c8', fontFamily: 'monospace' }}>
                    {b.batch_no}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.product_name}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>product_id: {b.product_id}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                    {b.production_date}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {b.expiry_date}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {getStatusBadge(b.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Batch Modal */}
      {isAddBatchModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddBatchModalOpen(false)}>
          <div
            className="glass-card"
            style={{
              width: '520px',
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
              <div>
                <span className="badge badge-info">ERD: batches TABLE</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>
                  Registrasi Batch Baru
                </h3>
              </div>
              <button onClick={() => setIsAddBatchModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Membuat data batch baru dengan validasi integritas unik pada kombinasi <code>(product_id, batch_no)</code>.
            </p>

            <form onSubmit={handleAddBatch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Pilih Produk Master (product_id) *
                </label>
                <select
                  value={batchProductId}
                  onChange={(e) => setBatchProductId(Number(e.target.value))}
                  className="input-control"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Nomor Batch (batch_no) *
                </label>
                <input
                  type="text"
                  required
                  value={newBatchNo}
                  onChange={(e) => setNewBatchNo(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tanggal Produksi
                  </label>
                  <input
                    type="date"
                    value={newProdDate}
                    onChange={(e) => setNewProdDate(e.target.value)}
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tanggal Expired *
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpDate}
                    onChange={(e) => setNewExpDate(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddBatchModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> Simpan Batch ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
