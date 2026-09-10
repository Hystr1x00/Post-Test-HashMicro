'use client';

import React, { useState } from 'react';
import { GoodsReceipt, Product, Warehouse, Batch } from '@/types';
import { GOODS_RECEIPTS, PRODUCTS, WAREHOUSES, BATCHES } from '@/data/mockData';
import { useToast } from '@/context/ToastContext';
import {
  ArrowDownLeft,
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
  DollarSign,
  Truck,
  Sparkles,
} from 'lucide-react';

interface InboundReceiptsPageProps {
  receipts?: GoodsReceipt[];
  onAddReceipt?: (newReceipt: GoodsReceipt) => void;
}

export const InboundReceiptsPage: React.FC<InboundReceiptsPageProps> = ({
  receipts: externalReceipts,
  onAddReceipt,
}) => {
  const { showToast } = useToast();
  const [receiptsList, setReceiptsList] = useState<GoodsReceipt[]>(externalReceipts || GOODS_RECEIPTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Inbound Form States
  const [selectedWhId, setSelectedWhId] = useState<number>(1);
  const [selectedProdId, setSelectedProdId] = useState<number>(101);
  const [batchNo, setBatchNo] = useState(`BTH-${new Date().toISOString().slice(0, 7).replace('-', '')}-0${Math.floor(20 + Math.random() * 80)}`);
  const [prodDate, setProdDate] = useState(new Date().toISOString().slice(0, 10));
  const [expDate, setExpDate] = useState('2027-04-15');
  const [quantity, setQuantity] = useState('1000');
  const [unitPrice, setUnitPrice] = useState('245000');
  const [receiptNotes, setReceiptNotes] = useState('Inbound Finished Goods dari Lini Produksi Aseptik');

  const filteredReceipts = receiptsList.filter((r) => {
    const matchWh = warehouseFilter === 'all' || r.warehouse_id.toString() === warehouseFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSearch =
      r.receipt_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.warehouse_name && r.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.details && r.details.some((d) => d.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || d.batch_no?.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchWh && matchStatus && matchSearch;
  });

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    const price = Number(unitPrice);
    if (!qty || qty <= 0) {
      showToast('Harap masukkan kuantitas barang masuk yang valid.', 'warning');
      return;
    }

    const warehouse = WAREHOUSES.find((w) => w.warehouse_id === Number(selectedWhId)) || WAREHOUSES[0];
    const product = PRODUCTS.find((p) => p.product_id === Number(selectedProdId)) || PRODUCTS[0];
    const newReceiptId = Date.now();
    const newReceiptNo = `GR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReceipt: GoodsReceipt = {
      receipt_id: newReceiptId,
      warehouse_id: warehouse.warehouse_id,
      warehouse_name: warehouse.name,
      receipt_no: newReceiptNo,
      receipt_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'COMPLETED',
      total_items: qty,
      total_amount: qty * price,
      details: [
        {
          receipt_detail_id: Date.now() + 1,
          receipt_id: newReceiptId,
          batch_id: Date.now() + 2,
          batch_no: batchNo,
          product_name: product.name,
          uom: product.uom,
          quantity: qty,
          unit_price: price,
        },
      ],
    };

    setReceiptsList([newReceipt, ...receiptsList]);
    if (onAddReceipt) onAddReceipt(newReceipt);

    showToast(
      `Penerimaan Barang Masuk ${newReceiptNo} (${qty} ${product.uom} - Batch ${batchNo}) berhasil dicatat & masuk ke stok!`,
      'success',
      'Inbound Berhasil'
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
            <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
              <ArrowDownLeft size={12} /> 1. INBOUND MODULE (ERD: goods_receipts)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • Penerimaan Barang Masuk, Hasil Produksi Pabrik & Pembelian
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Goods Receipts (Penerimaan Barang Masuk)
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Setiap penerimaan barang masuk mencatat nomor batch, tanggal kadaluwarsa, kuantitas, harga pokok (HPP), dan otomatis memperbarui stok gudang.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => showToast('Ekspor rekapitulasi penerimaan barang masuk (Goods Receipts) ke Excel/PDF...', 'info')}
            className="btn btn-secondary"
          >
            <Download size={15} /> Unduh Rekap
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn btn-primary"
            style={{ backgroundColor: '#10B981' }}
          >
            <Plus size={16} /> Buat Goods Receipt Baru
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
            placeholder="Cari No. Receipt, Batch, Produk..."
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
            <option value="all">Semua Gudang Penerima</option>
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
            <option value="DRAFT">DRAFT (Dalam Proses)</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Goods Receipts Table */}
      <div className="glass-card" style={{ borderRadius: '24px', padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>NO. RECEIPT</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>WAKTU PENERIMAAN</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>GUDANG PENERIMA (warehouse_id)</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>RINCIAN BATCH & PRODUK</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>TOTAL KUANTITAS</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>NILAI MASUK (IDR)</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>STATUS</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map((gr) => (
              <tr
                key={gr.receipt_id}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>
                  {gr.receipt_no}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} />
                    <span>{gr.receipt_date}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{gr.warehouse_name}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>ID: WH-0{gr.warehouse_id}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {gr.details && gr.details.length > 0 ? (
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {gr.details[0].product_name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#00529b', fontFamily: 'monospace' }}>
                        Batch: {gr.details[0].batch_no}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>1 Batch Terlampir</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {gr.total_items?.toLocaleString('id-ID')} Karton
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#10B981' }}>
                  Rp {(gr.total_amount || 0).toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span
                    className={`badge ${
                      gr.status === 'COMPLETED'
                        ? 'badge-success'
                        : gr.status === 'DRAFT'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                    style={{ fontSize: '0.6875rem', fontWeight: 700 }}
                  >
                    {gr.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedReceipt(gr)}
                    className="btn-icon"
                    title="Lihat Detail Penerimaan (goods_receipt_details)"
                  >
                    <Eye size={15} color="#00529b" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Detail Modal */}
      {selectedReceipt && (
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
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
                <span className="badge badge-success">INBOUND DETAIL • goods_receipt_details</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px' }}>
                  Detail Penerimaan: {selectedReceipt.receipt_no}
                </h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8125rem' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '12px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Gudang Penerima:</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>{selectedReceipt.warehouse_name}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '12px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Waktu & Status:</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>
                  {selectedReceipt.receipt_date} • <span style={{ color: '#10B981' }}>{selectedReceipt.status}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '8px' }}>
                Rincian Item & Batch (goods_receipt_details)
              </h4>
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
                <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>PRODUK & BATCH NO.</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>KUANTITAS</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>HARGA SATUAN</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReceipt.details?.map((d) => (
                      <tr key={d.receipt_detail_id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700 }}>{d.product_name}</div>
                          <div style={{ color: '#00529b', fontFamily: 'monospace' }}>Batch: {d.batch_no}</div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                          {d.quantity.toLocaleString('id-ID')} {d.uom}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          Rp {d.unit_price.toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#10B981' }}>
                          Rp {(d.quantity * d.unit_price).toLocaleString('id-ID')}
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
                  showToast(`Bukti Penerimaan Barang (GR) ${selectedReceipt.receipt_no} dikirim ke cetak PDF.`, 'info');
                  setSelectedReceipt(null);
                }}
                className="btn btn-primary"
                style={{ backgroundColor: '#10B981' }}
              >
                Cetak Bukti Penerimaan (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Goods Receipt Modal */}
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
                <span className="badge badge-success">FORM INBOUND RESMI</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>
                  Buat Goods Receipt (Barang Masuk)
                </h3>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Gudang Tujuan Penerima *
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
                    Produk / SKU Master *
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

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nomor Batch (batch_no) *
                  </label>
                  <input
                    type="text"
                    required
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tgl Produksi
                  </label>
                  <input
                    type="date"
                    value={prodDate}
                    onChange={(e) => setProdDate(e.target.value)}
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tgl Expired *
                  </label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Kuantitas Masuk (Karton) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Harga Pokok Satuan (HPP - IDR)
                  </label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Catatan Penerimaan / Dokumen PO
                </label>
                <input
                  type="text"
                  value={receiptNotes}
                  onChange={(e) => setReceiptNotes(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsNewModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10B981' }}>
                  <Plus size={16} /> Simpan Goods Receipt & Tambah Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
