'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import {
  Receipt,
  Search,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Building,
} from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const { showToast } = useToast();
  const [invoices] = useState([
    {
      id: 'INV-2026-8801',
      doNumber: 'DO-2026-901',
      customer: 'PT. Indomarco Prismatama (Indomaret Hub Jabar)',
      product: 'Ultra Milk Cokelat 250ml (Batch BTH-202607-001)',
      amount: 145000000,
      quantity: '850 Karton',
      date: '2026-09-08',
      status: 'paid',
      deliveryStatus: 'delivered',
    },
    {
      id: 'INV-2026-8802',
      doNumber: 'DO-2026-902',
      customer: 'PT. Sumber Alfaria Trijaya (Alfamart Surabaya)',
      product: 'Sari Kacang Ijo 250ml (Batch BTH-202607-014)',
      amount: 85200000,
      quantity: '600 Karton',
      date: '2026-09-07',
      status: 'paid',
      deliveryStatus: 'in_transit',
    },
    {
      id: 'INV-2026-8803',
      doNumber: 'DO-2026-903',
      customer: 'Lion Superindo Modern Retail',
      product: 'Ultra Milk Full Cream 1000ml (Batch BTH-202608-005)',
      amount: 235000000,
      quantity: '960 Karton',
      date: '2026-09-06',
      status: 'pending',
      deliveryStatus: 'loading',
    },
  ]);

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
            <Receipt size={20} color="#00529b" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Faktur Penjualan & Surat Jalan (Delivery Orders)
            </h2>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Rekap invoice penjualan ritel B2B, status pengiriman armada truk logistik, dan dokumen bukti serah terima.
          </p>
        </div>

        <button
          onClick={() => showToast('Mempersiapkan rekapitulasi faktur pajak elektronik...', 'info')}
          className="btn btn-secondary"
        >
          <Download size={15} /> Unduh Rekap Pajak
        </button>
      </div>

      {/* Invoice List Table */}
      <div className="glass-card" style={{ borderRadius: '24px', padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>NO. INVOICE & DO</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>DISTRIBUTOR / KLIEN</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>ITEM BATCH TERKIRIM</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>NILAI INVOICE</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>STATUS PEMBAYARAN</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>LOGISTIK</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 800, color: '#00529b' }}>{inv.id}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{inv.doNumber}</div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {inv.customer}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                  <div>{inv.product}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Volume: {inv.quantity}</div>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Rp {inv.amount.toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span className={`badge ${inv.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {inv.status === 'paid' ? 'Lunas' : 'Menunggu'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                    <Truck size={12} /> {inv.deliveryStatus === 'delivered' ? 'Terkirim' : 'Dalam Perjalanan'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => showToast(`Cetak Delivery Order & Faktur ${inv.id} dikirim ke printer.`, 'info')}
                    className="btn-icon"
                    title="Cetak Faktur PDF"
                  >
                    <Printer size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
