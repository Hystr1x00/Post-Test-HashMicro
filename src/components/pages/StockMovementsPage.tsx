'use client';

import React, { useState } from 'react';
import { STOCK_MOVEMENTS, WAREHOUSES, BATCHES, PRODUCTS } from '@/data/mockData';
import { StockMovement, MovementType } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Calendar,
  User,
  CheckCircle2,
  Sliders,
  Plus,
  X,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

export const StockMovementsPage: React.FC = () => {
  const { showToast } = useToast();
  const [movements, setMovements] = useState<StockMovement[]>(STOCK_MOVEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Transfer Form States
  const [fromWhId, setFromWhId] = useState<number>(1);
  const [toWhId, setToWhId] = useState<number>(2);
  const [transferBatchId, setTransferBatchId] = useState<number>(1005);
  const [transferQty, setTransferQty] = useState('200');
  const [transferReason, setTransferReason] = useState('Inter-Warehouse Stock Balancing Jawa Timur');

  // Adjustment Form States
  const [adjWhId, setAdjWhId] = useState<number>(3);
  const [adjBatchId, setAdjBatchId] = useState<number>(1004);
  const [adjQty, setAdjQty] = useState('15');
  const [adjReason, setAdjReason] = useState('Sampling Uji Kualitas Mutu Laboratorium Aseptik');

  const filteredMovements = movements.filter((m) => {
    const matchType = typeFilter === 'all' || m.movement_type === typeFilter;
    const matchSearch =
      m.movement_id.toString().includes(searchTerm) ||
      (m.product_name && m.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.batch_number && m.batch_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.notes && m.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.created_by && m.created_by.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchType && matchSearch;
  });

  const getMovementBadge = (type: MovementType) => {
    switch (type) {
      case 'IN':
        return (
          <span className="badge badge-success" style={{ fontWeight: 700 }}>
            <ArrowDownLeft size={12} /> IN (Masuk)
          </span>
        );
      case 'OUT':
        return (
          <span className="badge badge-danger" style={{ fontWeight: 700 }}>
            <ArrowUpRight size={12} /> OUT (Keluar)
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="badge badge-info" style={{ fontWeight: 700 }}>
            <ArrowRightLeft size={12} /> TRANSFER (Mutasi)
          </span>
        );
      case 'ADJUSTMENT':
        return (
          <span className="badge badge-warning" style={{ fontWeight: 700 }}>
            <Sliders size={12} /> ADJUSTMENT (Koreksi)
          </span>
        );
      default:
        return <span className="badge badge-neutral">{type}</span>;
    }
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromWhId === toWhId) {
      showToast('Gudang asal dan tujuan tidak boleh sama.', 'warning');
      return;
    }

    const fromWh = WAREHOUSES.find((w) => w.warehouse_id === fromWhId);
    const toWh = WAREHOUSES.find((w) => w.warehouse_id === toWhId);
    const batch = BATCHES.find((b) => b.batch_id === transferBatchId);
    const qty = Number(transferQty) || 100;

    const newMov: StockMovement = {
      movement_id: Date.now(),
      batch_id: batch?.batch_id || 1001,
      batch_number: batch?.batch_no,
      product_name: batch?.product_name,
      uom: 'Karton',
      source_warehouse_id: fromWhId,
      destination_warehouse_id: toWhId,
      source_warehouse_name: fromWh?.name,
      destination_warehouse_name: toWh?.name,
      movement_type: 'TRANSFER',
      quantity: qty,
      movement_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      created_by: 'Farid Ghani (Logistics Lead)',
      notes: transferReason,
    };

    setMovements([newMov, ...movements]);
    showToast(`Transfer stok ${qty} Karton (${batch?.batch_no}) dari ${fromWh?.name} ke ${toWh?.name} berhasil dicatat di Ledger!`, 'success');
    setIsTransferModalOpen(false);
  };

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = WAREHOUSES.find((w) => w.warehouse_id === adjWhId);
    const batch = BATCHES.find((b) => b.batch_id === adjBatchId);
    const qty = Number(adjQty) || 10;

    const newMov: StockMovement = {
      movement_id: Date.now(),
      batch_id: batch?.batch_id || 1001,
      batch_number: batch?.batch_no,
      product_name: batch?.product_name,
      uom: 'Karton',
      source_warehouse_id: adjWhId,
      destination_warehouse_id: null,
      source_warehouse_name: wh?.name,
      destination_warehouse_name: 'Penyesuaian Fisik / QA',
      movement_type: 'ADJUSTMENT',
      quantity: qty,
      movement_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      created_by: 'Farid Ghani (Logistics Lead)',
      notes: adjReason,
    };

    setMovements([newMov, ...movements]);
    showToast(`Stock Adjustment ${qty} Karton pada ${wh?.name} berhasil dicatat di Stock Ledger!`, 'success');
    setIsAdjustModalOpen(false);
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
              <CreditCard size={12} /> 3. STOCK LEDGER (ERD: stock_movements)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • Buku Besar Mutasi Stok & Jejak Audit Perpindahan Barang
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Stock Movements Ledger & Audit Trail
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Mencatat setiap pergerakan stok: <b>IN</b> (Barang Masuk), <b>OUT</b> (Barang Keluar), <b>TRANSFER</b> (Antar Gudang), dan <b>ADJUSTMENT</b> (Penyesuaian Fisik/QA) secara real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="btn btn-secondary"
          >
            <Sliders size={15} /> Penyesuaian Stok (Adjustment)
          </button>
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="btn btn-primary"
          >
            <ArrowRightLeft size={16} /> Transfer Antar Gudang
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '340px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari No. Batch, Produk, Operator, Catatan..."
            className="input-control"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid',
                borderColor: typeFilter === t ? '#00529b' : 'var(--border-subtle)',
                backgroundColor: typeFilter === t ? 'rgba(0, 82, 155, 0.12)' : 'var(--bg-surface)',
                color: typeFilter === t ? '#00529b' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {t === 'all' ? 'Semua Tipe Ledger' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Ledger Table */}
      <div className="glass-card" style={{ borderRadius: '24px', padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>ID PERGERAKAN</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>TIPE PERGERAKAN</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>PRODUK & NO. BATCH</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>ASAL → TUJUAN GUDANG</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>KUANTITAS</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>CATATAN / ALASAN</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>WAKTU & OPERATOR</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.map((m) => (
              <tr
                key={m.movement_id}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0077c8', fontFamily: 'monospace' }}>
                  MOV-#{m.movement_id}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {getMovementBadge(m.movement_type)}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.product_name}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Batch: {m.batch_number} (batch_id: {m.batch_id})
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                  {m.movement_type === 'TRANSFER' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600 }}>{m.source_warehouse_name?.split(' ')[0]}</span>
                      <ArrowRightLeft size={12} color="#00529b" />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.destination_warehouse_name?.split(' ')[0]}</span>
                    </div>
                  ) : m.movement_type === 'IN' ? (
                    <div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Ke: </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.destination_warehouse_name}</span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Dari: </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.source_warehouse_name}</span>
                    </div>
                  )}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {m.quantity.toLocaleString('id-ID')} {m.uom || 'Karton'}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                  {m.notes || '-'}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div>{m.movement_date}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{m.created_by}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transfer Antar Gudang Modal */}
      {isTransferModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTransferModalOpen(false)}>
          <div
            className="glass-card"
            style={{
              width: '540px',
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
                <span className="badge badge-info">MUTASI ANTAR GUDANG</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>
                  Perintah Transfer Stok (stock_movements)
                </h3>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Gudang Asal (source_warehouse_id) *
                  </label>
                  <select
                    value={fromWhId}
                    onChange={(e) => setFromWhId(Number(e.target.value))}
                    className="input-control"
                  >
                    {WAREHOUSES.map((w) => (
                      <option key={w.warehouse_id} value={w.warehouse_id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Gudang Tujuan (destination_warehouse_id) *
                  </label>
                  <select
                    value={toWhId}
                    onChange={(e) => setToWhId(Number(e.target.value))}
                    className="input-control"
                  >
                    {WAREHOUSES.map((w) => (
                      <option key={w.warehouse_id} value={w.warehouse_id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Pilih Batch Produk *
                  </label>
                  <select
                    value={transferBatchId}
                    onChange={(e) => setTransferBatchId(Number(e.target.value))}
                    className="input-control"
                  >
                    {BATCHES.map((b) => (
                      <option key={b.batch_id} value={b.batch_id}>
                        {b.batch_no} - {b.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Kuantitas Transfer (Karton) *
                  </label>
                  <input
                    type="number"
                    required
                    value={transferQty}
                    onChange={(e) => setTransferQty(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Alasan / Keterangan Mutasi (notes)
                </label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <ArrowRightLeft size={16} /> Catat Mutasi & Eksekusi Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAdjustModalOpen(false)}>
          <div
            className="glass-card"
            style={{
              width: '540px',
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
                <span className="badge badge-warning">STOCK ADJUSTMENT</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>
                  Penyesuaian Stok Fisik / QA Sampling
                </h3>
              </div>
              <button onClick={() => setIsAdjustModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Lokasi Gudang Terkait *
                </label>
                <select
                  value={adjWhId}
                  onChange={(e) => setAdjWhId(Number(e.target.value))}
                  className="input-control"
                >
                  {WAREHOUSES.map((w) => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Batch Terkoreksi *
                  </label>
                  <select
                    value={adjBatchId}
                    onChange={(e) => setAdjBatchId(Number(e.target.value))}
                    className="input-control"
                  >
                    {BATCHES.map((b) => (
                      <option key={b.batch_id} value={b.batch_id}>
                        {b.batch_no} - {b.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Volume Koreksi (Karton) *
                  </label>
                  <input
                    type="number"
                    required
                    value={adjQty}
                    onChange={(e) => setAdjQty(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Alasan Koreksi / Penyesuaian (notes) *
                </label>
                <input
                  type="text"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#F59E0B' }}>
                  <Sliders size={16} /> Simpan Adjustment ke Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
