'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types';
import { useToast } from '@/context/ToastContext';
import { X, Plus, Building2, Package, CreditCard, MapPin } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (newTx: Transaction) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose, onAddTransaction }) => {
  const { showToast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [product, setProduct] = useState('HashMicro ERP Enterprise Tier (500 Users)');
  const [amount, setAmount] = useState('120000000');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (BCA)');
  const [shippingCity, setShippingCity] = useState('Jakarta Selatan');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim()) {
      showToast('Harap isi nama klien dan email dengan lengkap.', 'warning', 'Validasi Form');
      return;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      orderNumber: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerEmail,
      customerAvatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 999999)}?w=100&h=100&fit=crop&crop=faces`,
      product,
      amount: Number(amount) || 50000000,
      currency: 'IDR',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'processing',
      paymentMethod,
      itemsCount: 1,
      shippingCity,
    };

    onAddTransaction(newTx);
    showToast(`Pesanan ${newTx.orderNumber} untuk ${customerName} berhasil dibuat!`, 'success', 'Order Dibuat');
    onClose();

    // Reset form
    setCustomerName('');
    setCustomerEmail('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-card"
        style={{
          width: '540px',
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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>MODUL PENJUALAN</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Buat Sales Order / Kontrak Baru
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Nama Perusahaan / Klien Enterprise *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="cth. PT. Surya Mas Semesta"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Email PIC / Procurement *
            </label>
            <input
              type="email"
              required
              placeholder="cth. procurement@suryamas.co.id"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="input-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Paket Produk / Modul ERP
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="input-control"
                style={{ cursor: 'pointer' }}
              >
                <option value="HashMicro ERP Enterprise Tier (500 Users)">HashMicro ERP Enterprise</option>
                <option value="Warehouse Management Module + Scanners">Warehouse Management Pro</option>
                <option value="Supply Chain & Procurement Automation">Supply Chain Automation</option>
                <option value="POS Cloud Sync Multi-Store">POS Cloud Sync</option>
                <option value="Custom API Gateway & Integration">Custom API Gateway</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Nilai Kontrak (IDR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Metode Pembayaran
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input-control"
                style={{ cursor: 'pointer' }}
              >
                <option value="Bank Transfer (BCA)">Bank Transfer (BCA)</option>
                <option value="Virtual Account Mandiri">Virtual Account Mandiri</option>
                <option value="Corporate Credit Card">Corporate Credit Card</option>
                <option value="Letter of Credit">Letter of Credit (L/C)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Lokasi Kantor / Cabang
              </label>
              <input
                type="text"
                value={shippingCity}
                onChange={(e) => setShippingCity(e.target.value)}
                className="input-control"
                placeholder="Jakarta Selatan"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Simpan & Terbitkan Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
