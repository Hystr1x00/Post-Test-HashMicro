'use client';

import React, { useState, useMemo } from 'react';
import { GoodsIssue, GoodsIssueDetail, Product, Warehouse, Batch, InventoryItem } from '@/types';
import { GOODS_ISSUES, PRODUCTS, WAREHOUSES, BATCHES, INVENTORY_FEFO_ITEMS } from '@/data/mockData';
import { useToast } from '@/context/ToastContext';
import {
  ArrowUpRight,
  Plus,
  Search,
  Download,
  Calendar,
  Building2,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  Eye,
  X,
  FileText,
  Truck,
  Sparkles,
  Zap,
  AlertTriangle,
} from 'lucide-react';

interface OutboundIssuesPageProps {
  issues?: GoodsIssue[];
  onAddIssue?: (newIssue: GoodsIssue) => void;
  inventoryItems?: InventoryItem[];
}

export const OutboundIssuesPage: React.FC<OutboundIssuesPageProps> = ({
  issues: externalIssues,
  onAddIssue,
  inventoryItems = INVENTORY_FEFO_ITEMS,
}) => {
  const { showToast } = useToast();
  const [issuesList, setIssuesList] = useState<GoodsIssue[]>(externalIssues || GOODS_ISSUES);
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<GoodsIssue | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Outbound Form States
  const [selectedWhId, setSelectedWhId] = useState<number>(1);
  const [selectedProdId, setSelectedProdId] = useState<number>(102); // default Ultra Milk Cokelat
  const [selectedBatchId, setSelectedBatchId] = useState<number>(1001);
  const [clientName, setClientName] = useState('PT. Indomarco Prismatama (Indomaret Hub Jabar)');
  const [quantity, setQuantity] = useState('100');
  const [issueNotes, setIssueNotes] = useState('Sales Order Reguler - FEFO Automated Batch Allocation');

  // Find candidate batches in the selected warehouse for the selected product
  const availableStockCandidates = useMemo(() => {
    return inventoryItems
      .filter((item) => item.warehouse_id === Number(selectedWhId) && item.product_id === Number(selectedProdId))
      .sort((a, b) => a.days_to_expiry - b.days_to_expiry);
  }, [inventoryItems, selectedWhId, selectedProdId]);

  // Recommended FEFO Batch (earliest expiry)
  const fefoRecommendedBatch = availableStockCandidates[0];

  const filteredIssues = issuesList.filter((iss) => {
    const matchWh = warehouseFilter === 'all' || iss.warehouse_id.toString() === warehouseFilter;
    const matchStatus = statusFilter === 'all' || iss.status === statusFilter;
    const matchSearch =
      iss.issue_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (iss.destination_client && iss.destination_client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (iss.warehouse_name && iss.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (iss.details && iss.details.some((d) => d.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || d.batch_no?.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchWh && matchStatus && matchSearch;
  });

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      showToast('Harap masukkan kuantitas barang keluar yang valid.', 'warning');
      return;
    }

    const warehouse = WAREHOUSES.find((w) => w.warehouse_id === Number(selectedWhId)) || WAREHOUSES[0];
    const product = PRODUCTS.find((p) => p.product_id === Number(selectedProdId)) || PRODUCTS[0];
    const chosenBatch = BATCHES.find((b) => b.batch_id === Number(selectedBatchId)) || BATCHES[0];
    const newIssueId = Date.now();
    const newIssueNo = `GI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newIssue: GoodsIssue = {
      issue_id: newIssueId,
      warehouse_id: warehouse.warehouse_id,
      warehouse_name: warehouse.name,
      destination_client: clientName,
      issue_no: newIssueNo,
      issue_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'DISPATCHED',
      total_quantity: qty,
      details: [
        {
          issue_detail_id: Date.now() + 1,
          issue_id: newIssueId,
          batch_id: chosenBatch.batch_id,
          batch_no: chosenBatch.batch_no,
          product_name: product.name,
          uom: product.uom,
          quantity: qty,
        },
      ],
    };

    setIssuesList([newIssue, ...issuesList]);
    if (onAddIssue) onAddIssue(newIssue);

    showToast(
      `Pengeluaran Barang ${newIssueNo} (${qty} Karton - Batch ${chosenBatch.batch_no}) untuk ${clientName} berhasil diterbitkan!`,
      'success',
      'Outbound Terbit'
    );
    setIsNewModalOpen(false);
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
            <span className="badge badge-danger" style={{ fontSize: '0.6875rem' }}>
              <ArrowUpRight size={12} /> 2. OUTBOUND MODULE (ERD: goods_issues)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • Pengeluaran Barang Keluar, Penjualan B2B & FEFO Dispatch
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Goods Issues (Pengeluaran Barang & Surat Jalan)
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Setiap pengeluaran barang memotong inventaris gudang secara akurat berdasarkan alokasi FEFO (batch dengan tanggal kedaluwarsa terdekat diprioritaskan keluar).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => showToast('Ekspor rekapitulasi surat jalan pengeluaran (Goods Issues) ke Excel/PDF...', 'info')}
            className="btn btn-secondary"
          >
            <Download size={15} /> Unduh Rekap DO
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn btn-primary"
            style={{ backgroundColor: '#EF4444' }}
          >
            <Plus size={16} /> Terbitkan Goods Issue Baru
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
            placeholder="Cari No. Issue, Klien, Batch, Produk..."
            className="input-control"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="input-control"
            style={{ width: 'auto', minWidth: '180px', height: '40px' }}
          >
            <option value="all">Semua Gudang Asal</option>
            {WAREHOUSES.map((w) => (
              <option key={w.warehouse_id} value={w.warehouse_id.toString()}>
                {w.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-control"
            style={{ width: 'auto', height: '40px' }}
          >
            <option value="all">Semua Status</option>
            <option value="COMPLETED">COMPLETED (Selesai)</option>
            <option value="DISPATCHED">DISPATCHED (Dalam Pengiriman)</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      {/* Goods Issues Table */}
      <div className="glass-card" style={{ borderRadius: '24px', padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>NO. ISSUE (DO)</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>WAKTU KELUAR</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>GUDANG ASAL</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>TUJUAN DISTRIBUTOR / KLIEN</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>RINCIAN BATCH FEFO</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>VOLUME KELUAR</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>STATUS</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((gi) => (
              <tr
                key={gi.issue_id}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#EF4444', fontFamily: 'monospace' }}>
                  {gi.issue_no}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} />
                    <span>{gi.issue_date}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{gi.warehouse_name}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>ID: WH-0{gi.warehouse_id}</div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {gi.destination_client || 'Distributor Jaringan'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {gi.details && gi.details.length > 0 ? (
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {gi.details[0].product_name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#EF4444', fontFamily: 'monospace' }}>
                        Batch Keluar: {gi.details[0].batch_no}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>1 Batch Terlampir</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {gi.total_quantity?.toLocaleString('id-ID')} Karton
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span
                    className={`badge ${
                      gi.status === 'COMPLETED'
                        ? 'badge-success'
                        : gi.status === 'DISPATCHED'
                        ? 'badge-info'
                        : 'badge-warning'
                    }`}
                    style={{ fontSize: '0.6875rem', fontWeight: 700 }}
                  >
                    {gi.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedIssue(gi)}
                    className="btn-icon"
                    title="Lihat Detail Pengeluaran (goods_issue_details)"
                  >
                    <Eye size={15} color="#00529b" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div
            className="glass-card"
            style={{
              width: '600px',
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
                <span className="badge badge-danger">OUTBOUND DETAIL • goods_issue_details</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px' }}>
                  Detail Surat Jalan: {selectedIssue.issue_no}
                </h3>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8125rem' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '12px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Gudang Pengirim & Waktu:</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>
                  {selectedIssue.warehouse_name} ({selectedIssue.issue_date})
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '12px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Penerima / Klien:</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>
                  {selectedIssue.destination_client}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '8px' }}>
                Rincian Batch Teralokasi (goods_issue_details)
              </h4>
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
                <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>PRODUK & NO. BATCH</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>KUANTITAS KELUAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedIssue.details?.map((d) => (
                      <tr key={d.issue_detail_id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700 }}>{d.product_name}</div>
                          <div style={{ color: '#EF4444', fontFamily: 'monospace' }}>Batch: {d.batch_no}</div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>
                          {d.quantity.toLocaleString('id-ID')} {d.uom}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => {
                  showToast(`Surat Jalan (Delivery Order) ${selectedIssue.issue_no} dikirim ke cetak.`, 'info');
                  setSelectedIssue(null);
                }}
                className="btn btn-primary"
                style={{ backgroundColor: '#EF4444' }}
              >
                Cetak Surat Jalan & DO (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Goods Issue Modal */}
      {isNewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewModalOpen(false)}>
          <div
            className="glass-card"
            style={{
              width: '560px',
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
                <span className="badge badge-danger">FORM OUTBOUND RESMI</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>
                  Terbitkan Goods Issue (Barang Keluar)
                </h3>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            {/* Smart FEFO Recommendation Alert */}
            {fefoRecommendedBatch && (
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.75rem',
                }}
              >
                <Sparkles size={18} color="#00529b" />
                <div>
                  <span style={{ fontWeight: 700, color: '#00529b' }}>Rekomendasi FEFO Auto-Engine:</span>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Batch <b>{fefoRecommendedBatch.batch_number}</b> (Sisa {fefoRecommendedBatch.days_to_expiry} hari, stok {fefoRecommendedBatch.quantity} Karton) adalah prioritas #1 untuk dikeluarkan pertama!
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateIssue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Gudang Pengirim *
                  </label>
                  <select
                    value={selectedWhId}
                    onChange={(e) => setSelectedWhId(Number(e.target.value))}
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
                    Produk *
                  </label>
                  <select
                    value={selectedProdId}
                    onChange={(e) => setSelectedProdId(Number(e.target.value))}
                    className="input-control"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Distributor / Klien Tujuan Pengiriman *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="cth: PT. Indomarco Prismatama Hub Jabar"
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Alokasi Batch (FEFO Prioritas) *
                  </label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                    className="input-control"
                  >
                    {BATCHES.filter((b) => b.product_id === selectedProdId).map((b) => (
                      <option key={b.batch_id} value={b.batch_id}>
                        {b.batch_no} (Exp: {b.expiry_date} - {b.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Kuantitas Keluar (Karton) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Catatan / Keterangan Order
                </label>
                <input
                  type="text"
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsNewModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#EF4444' }}>
                  <ArrowUpRight size={16} /> Terbitkan Goods Issue & Potong Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
