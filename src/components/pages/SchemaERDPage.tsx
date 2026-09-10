'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import {
  Database,
  Table,
  Key,
  Link as LinkIcon,
  Copy,
  Check,
  Code,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  CATEGORIES,
  PRODUCTS,
  BATCHES,
  WAREHOUSES,
  INVENTORY,
  GOODS_RECEIPTS,
  GOODS_RECEIPT_DETAILS,
  GOODS_ISSUES,
  GOODS_ISSUE_DETAILS,
  STOCK_MOVEMENTS,
} from '@/data/mockData';

export const SchemaERDPage: React.FC = () => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const rawDBML = `// PT. Ultra Jaya - Inventory Management System (Refined)
// DBML for dbdiagram.io

Table categories {
  category_id int [pk]
  name varchar [not null]
  description varchar
}

Table products {
  product_id int [pk]
  category_id int [not null]
  name varchar [not null]
  description varchar
  uom varchar [not null]
  min_stock_level decimal
}

Table batches {
  batch_id int [pk]
  product_id int [not null]
  batch_no varchar [not null]
  production_date date
  expiry_date date [not null]
  status varchar [not null]

  indexes {
    (product_id, batch_no) [unique]
  }
}

Table warehouses {
  warehouse_id int [pk]
  name varchar [not null]
  location varchar
  status varchar
}

Table inventory {
  inventory_id int [pk]
  warehouse_id int [not null]
  batch_id int [not null]
  quantity decimal [not null]

  indexes {
    (warehouse_id, batch_id) [unique]
  }
}

// --- 1. INBOUND (Barang Masuk / Pembelian) ---
Table goods_receipts {
  receipt_id int [pk]
  warehouse_id int [not null]
  receipt_no varchar [not null]
  receipt_date timestamp [not null]
  status varchar [not null]
}

Table goods_receipt_details {
  receipt_detail_id int [pk]
  receipt_id int [not null]
  batch_id int [not null]
  quantity decimal [not null]
  unit_price decimal [not null]
}

// --- 2. OUTBOUND (Barang Keluar / Penjualan / Produksi) ---
Table goods_issues {
  issue_id int [pk]
  warehouse_id int [not null]
  issue_no varchar [not null]
  issue_date timestamp [not null]
  status varchar [not null]
}

Table goods_issue_details {
  issue_detail_id int [pk]
  issue_id int [not null]
  batch_id int [not null]
  quantity decimal [not null]
}

// --- 3. STOCK LEDGER / PERGERAKAN STOK ---
Table stock_movements {
  movement_id int [pk]
  batch_id int [not null]
  source_warehouse_id int
  destination_warehouse_id int
  movement_type varchar [not null] // e.g., 'IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'
  quantity decimal [not null]
  movement_date timestamp [not null]
  created_by varchar [not null]
  notes varchar
}

// ========================
// Relationships
// ========================
Ref: categories.category_id < products.category_id
Ref: products.product_id < batches.product_id
Ref: warehouses.warehouse_id < inventory.warehouse_id
Ref: batches.batch_id < inventory.batch_id

// Relasi Inbound
Ref: warehouses.warehouse_id < goods_receipts.warehouse_id
Ref: goods_receipts.receipt_id < goods_receipt_details.receipt_id
Ref: batches.batch_id < goods_receipt_details.batch_id

// Relasi Outbound
Ref: warehouses.warehouse_id < goods_issues.warehouse_id
Ref: goods_issues.issue_id < goods_issue_details.issue_id
Ref: batches.batch_id < goods_issue_details.batch_id

// Relasi Stock Movements
Ref: batches.batch_id < stock_movements.batch_id
Ref: warehouses.warehouse_id < stock_movements.source_warehouse_id
Ref: warehouses.warehouse_id < stock_movements.destination_warehouse_id`;

  const tablesData = [
    {
      name: 'categories',
      description: 'Master kategori produk minuman steril & nutrisi',
      count: CATEGORIES.length,
      category: 'Master Data',
      color: '#00529b',
      columns: [
        { name: 'category_id', type: 'int', isPk: true },
        { name: 'name', type: 'varchar', isNull: false },
        { name: 'description', type: 'varchar' },
      ],
    },
    {
      name: 'products',
      description: 'Master SKU produk, standar kemasan (UoM) & batas minimum stok',
      count: PRODUCTS.length,
      category: 'Master Data',
      color: '#00529b',
      columns: [
        { name: 'product_id', type: 'int', isPk: true },
        { name: 'category_id', type: 'int', isFk: true, ref: 'categories.category_id' },
        { name: 'name', type: 'varchar', isNull: false },
        { name: 'description', type: 'varchar' },
        { name: 'uom', type: 'varchar', isNull: false },
        { name: 'min_stock_level', type: 'decimal' },
      ],
    },
    {
      name: 'batches',
      description: 'Siklus hidup batch produksi, tanggal kedaluwarsa & status FEFO',
      count: BATCHES.length,
      category: 'Master Data',
      color: '#06B6D4',
      columns: [
        { name: 'batch_id', type: 'int', isPk: true },
        { name: 'product_id', type: 'int', isFk: true, ref: 'products.product_id' },
        { name: 'batch_no', type: 'varchar', isNull: false },
        { name: 'production_date', type: 'date' },
        { name: 'expiry_date', type: 'date', isNull: false },
        { name: 'status', type: 'varchar', isNull: false },
      ],
      unique: '(product_id, batch_no)',
    },
    {
      name: 'warehouses',
      description: 'Daftar gudang regional dan sentra distribusi nasional',
      count: WAREHOUSES.length,
      category: 'Master Data',
      color: '#8B5CF6',
      columns: [
        { name: 'warehouse_id', type: 'int', isPk: true },
        { name: 'name', type: 'varchar', isNull: false },
        { name: 'location', type: 'varchar' },
        { name: 'status', type: 'varchar' },
      ],
    },
    {
      name: 'inventory',
      description: 'Matriks stok fisik on-hand per gudang dan per batch',
      count: INVENTORY.length,
      category: 'Core Inventory',
      color: '#10B981',
      columns: [
        { name: 'inventory_id', type: 'int', isPk: true },
        { name: 'warehouse_id', type: 'int', isFk: true, ref: 'warehouses.warehouse_id' },
        { name: 'batch_id', type: 'int', isFk: true, ref: 'batches.batch_id' },
        { name: 'quantity', type: 'decimal', isNull: false },
      ],
      unique: '(warehouse_id, batch_id)',
    },
    {
      name: 'goods_receipts',
      description: 'Header dokumen penerimaan barang masuk / hasil produksi',
      count: GOODS_RECEIPTS.length,
      category: '1. Inbound',
      color: '#10B981',
      columns: [
        { name: 'receipt_id', type: 'int', isPk: true },
        { name: 'warehouse_id', type: 'int', isFk: true, ref: 'warehouses.warehouse_id' },
        { name: 'receipt_no', type: 'varchar', isNull: false },
        { name: 'receipt_date', type: 'timestamp', isNull: false },
        { name: 'status', type: 'varchar', isNull: false },
      ],
    },
    {
      name: 'goods_receipt_details',
      description: 'Rincian batch, kuantitas dan harga satuan barang masuk',
      count: GOODS_RECEIPT_DETAILS.length,
      category: '1. Inbound',
      color: '#10B981',
      columns: [
        { name: 'receipt_detail_id', type: 'int', isPk: true },
        { name: 'receipt_id', type: 'int', isFk: true, ref: 'goods_receipts.receipt_id' },
        { name: 'batch_id', type: 'int', isFk: true, ref: 'batches.batch_id' },
        { name: 'quantity', type: 'decimal', isNull: false },
        { name: 'unit_price', type: 'decimal', isNull: false },
      ],
    },
    {
      name: 'goods_issues',
      description: 'Header dokumen pengeluaran barang & surat jalan (DO)',
      count: GOODS_ISSUES.length,
      category: '2. Outbound',
      color: '#EF4444',
      columns: [
        { name: 'issue_id', type: 'int', isPk: true },
        { name: 'warehouse_id', type: 'int', isFk: true, ref: 'warehouses.warehouse_id' },
        { name: 'issue_no', type: 'varchar', isNull: false },
        { name: 'issue_date', type: 'timestamp', isNull: false },
        { name: 'status', type: 'varchar', isNull: false },
      ],
    },
    {
      name: 'goods_issue_details',
      description: 'Rincian alokasi batch dan kuantitas barang keluar (FEFO)',
      count: GOODS_ISSUE_DETAILS.length,
      category: '2. Outbound',
      color: '#EF4444',
      columns: [
        { name: 'issue_detail_id', type: 'int', isPk: true },
        { name: 'issue_id', type: 'int', isFk: true, ref: 'goods_issues.issue_id' },
        { name: 'batch_id', type: 'int', isFk: true, ref: 'batches.batch_id' },
        { name: 'quantity', type: 'decimal', isNull: false },
      ],
    },
    {
      name: 'stock_movements',
      description: 'Buku besar pergerakan stok (IN, OUT, TRANSFER, ADJUSTMENT)',
      count: STOCK_MOVEMENTS.length,
      category: '3. Stock Ledger',
      color: '#F59E0B',
      columns: [
        { name: 'movement_id', type: 'int', isPk: true },
        { name: 'batch_id', type: 'int', isFk: true, ref: 'batches.batch_id' },
        { name: 'source_warehouse_id', type: 'int', isFk: true, ref: 'warehouses.warehouse_id' },
        { name: 'destination_warehouse_id', type: 'int', isFk: true, ref: 'warehouses.warehouse_id' },
        { name: 'movement_type', type: 'varchar', isNull: false },
        { name: 'quantity', type: 'decimal', isNull: false },
        { name: 'movement_date', type: 'timestamp', isNull: false },
        { name: 'created_by', type: 'varchar', isNull: false },
        { name: 'notes', type: 'varchar' },
      ],
    },
  ];

  const handleCopyDBML = () => {
    navigator.clipboard.writeText(rawDBML);
    setCopied(true);
    showToast('Kode DBML berhasil disalin ke clipboard! Siap di-paste ke dbdiagram.io.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
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
            <span className="badge badge-primary">
              <Database size={12} /> DBML SCHEMA ARCHITECTURE
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • 10 Entitas Relasional Terintegrasi Penuh
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ERD & Database Architecture Explorer
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Visualisasi struktur skema database PT. Ultra Jaya: Inbound (goods_receipts), Outbound (goods_issues), Stock Ledger (stock_movements), Batches, & Inventory.
          </p>
        </div>

        <button
          onClick={handleCopyDBML}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Tersalin!' : 'Salin DBML untuk dbdiagram.io'}
        </button>
      </div>

      {/* Relational Flow Diagram Overview */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          backgroundColor: 'var(--bg-surface-elevated)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#00529b" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Alur Relasional Utama:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-neutral">categories</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-neutral">products</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-neutral">batches</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-success">goods_receipts (Inbound)</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-info">inventory</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-danger">goods_issues (Outbound)</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-warning">stock_movements (Ledger)</span>
        </div>
      </div>

      {/* Grid of 10 Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
        {tablesData.map((tbl) => (
          <div
            key={tbl.name}
            className="glass-card"
            style={{
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              borderTop: `4px solid ${tbl.color}`,
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Table size={16} color={tbl.color} />
                  <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                    {tbl.name}
                  </span>
                </div>

                <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                  {tbl.count} Data
                </span>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {tbl.description}
              </p>

              {tbl.unique && (
                <div style={{ marginTop: '6px', fontSize: '0.6875rem', color: '#00529b', backgroundColor: 'rgba(0, 82, 155, 0.08)', padding: '3px 8px', borderRadius: '6px' }}>
                  🔒 <b>Unique Index:</b> {tbl.unique}
                </div>
              )}
            </div>

            {/* Columns List */}
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', fontSize: '0.6875rem', borderCollapse: 'collapse' }}>
                <tbody>
                  {tbl.columns.map((col) => (
                    <tr key={col.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '6px 10px', fontWeight: 600, fontFamily: 'monospace' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {col.isPk && <span title="Primary Key"><Key size={10} color="#F59E0B" /></span>}
                          {col.isFk && <span title="Foreign Key"><LinkIcon size={10} color="#00529b" /></span>}
                          <span style={{ color: col.isPk ? '#F59E0B' : 'var(--text-primary)' }}>{col.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-muted)', fontFamily: 'monospace', textAlign: 'right' }}>
                        {col.type}
                        {col.ref && <span style={{ color: '#00529b', display: 'block', fontSize: '0.625rem' }}>→ {col.ref}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              <span>Kategori: <b>{tbl.category}</b></span>
              <span style={{ color: tbl.color, fontWeight: 700 }}>Active in Schema</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
