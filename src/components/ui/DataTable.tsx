'use client';

import React, { useState, useMemo } from 'react';
import { Transaction, StatusType } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  X,
  Printer,
  FileText,
} from 'lucide-react';

interface DataTableProps {
  initialTransactions: Transaction[];
  onAddNewOrder?: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({ initialTransactions, onAddNewOrder }) => {
  const { showToast } = useToast();
  const [data, setData] = useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Status Filter options
  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  // Sorting logic
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesSearch =
        item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shippingCity.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [data, searchTerm, selectedStatus]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Status Badge Helper
  const renderStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Selesai
          </span>
        );
      case 'processing':
        return (
          <span className="badge badge-info">
            <Clock size={12} /> Proses
          </span>
        );
      case 'shipped':
        return (
          <span className="badge" style={{ backgroundColor: '#8b5cf620', color: '#a78bfa', border: '1px solid #8b5cf640' }}>
            <Truck size={12} /> Dikirim
          </span>
        );
      case 'pending':
        return (
          <span className="badge badge-warning">
            <AlertCircle size={12} /> Menunggu
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge badge-danger">
            <XCircle size={12} /> Batal
          </span>
        );
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Customer', 'Product', 'Amount', 'Date', 'Status', 'Payment Method', 'City'];
    const rows = sortedData.map((t) => [
      t.orderNumber,
      `"${t.customerName}"`,
      `"${t.product}"`,
      t.amount,
      t.date,
      t.status,
      `"${t.paymentMethod}"`,
      `"${t.shippingCity}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HashMicro_Sales_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan penjualan berhasil diexport ke CSV!', 'success', 'Export Sukses');
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header with Title & Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Daftar Pesanan & Transaksi Penjualan
            </h3>
            <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
              {sortedData.length} Data
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Monitoring transaksi real-time, status pembayaran B2B, dan fulfillment
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={15} /> Export CSV
          </button>
          {onAddNewOrder && (
            <button onClick={onAddNewOrder} className="btn btn-primary">
              + Buat Order Baru
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {/* Search input */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari order, pelanggan, produk..."
            className="input-control"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSelectedStatus(opt.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedStatus === opt.value ? 'var(--primary)' : 'var(--border-subtle)',
                backgroundColor: selectedStatus === opt.value ? 'var(--primary-light)' : 'var(--bg-surface-elevated)',
                color: selectedStatus === opt.value ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th
                onClick={() => handleSort('orderNumber')}
                style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  NO. ORDER <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleSort('customerName')}
                style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  PELANGGAN <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                PRODUK / LAYANAN
              </th>
              <th
                onClick={() => handleSort('amount')}
                style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none', textAlign: 'right' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                  NILAI KONTRAK <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>
                STATUS
              </th>
              <th
                onClick={() => handleSort('date')}
                style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  TANGGAL <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>
                AKSI
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <FileText size={32} opacity={0.5} />
                    <p style={{ fontSize: '0.875rem' }}>Tidak ada transaksi yang sesuai dengan filter pencarian.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((tx) => (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color var(--transition-fast)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  onClick={() => setSelectedTx(tx)}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--primary)' }}>
                    {tx.orderNumber}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={tx.customerAvatar}
                        alt={tx.customerName}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                          {tx.customerName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.shippingCity}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                    <div style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.product}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Rp {tx.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {renderStatusBadge(tx.status)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {tx.date}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="btn-icon"
                      title="Lihat Detail"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
        <div>
          Menampilkan {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} - {Math.min(currentPage * pageSize, sortedData.length)} dari {sortedData.length} total pesanan
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>
          <span style={{ padding: '0 8px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Halaman {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Selanjutnya <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Detail Modal / Drawer */}
      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div
            className="glass-card"
            style={{
              width: '560px',
              maxWidth: '100%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>DETAIL TRANSAKSI</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedTx.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedTx(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.875rem' }}>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Pesanan</div>
                  <div style={{ marginTop: '4px' }}>{renderStatusBadge(selectedTx.status)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Pembayaran</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--success-text)', marginTop: '2px' }}>
                    Rp {selectedTx.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Customer info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pelanggan</div>
                  <div style={{ fontWeight: 600 }}>{selectedTx.customerName}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{selectedTx.customerEmail}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Metode Pembayaran</div>
                  <div style={{ fontWeight: 600 }}>{selectedTx.paymentMethod}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Lokasi: {selectedTx.shippingCity}</div>
                </div>
              </div>

              {/* Product Info */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Item Layanan / Produk</div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600 }}>{selectedTx.product}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Kuantitas: {selectedTx.itemsCount} Paket / Modul • Tanggal Order: {selectedTx.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => {
                  showToast(`Invoice ${selectedTx.orderNumber} telah dikirim ke antrian cetak PDF.`, 'info', 'Cetak Invoice');
                }}
                className="btn btn-secondary"
              >
                <Printer size={16} /> Cetak Invoice
              </button>
              <button onClick={() => setSelectedTx(null)} className="btn btn-primary">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
