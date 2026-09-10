'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Settings, ShieldCheck, Zap, Sliders, Bell, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [criticalDays, setCriticalDays] = useState('30');
  const [nearExpiryDays, setNearExpiryDays] = useState('60');
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Konfigurasi algoritma FEFO & parameter alert berhasil disimpan!', 'success', 'Pengaturan Diperbarui');
  };

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
            <Settings size={20} color="#00529b" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Pengaturan Sistem & Parameter FEFO
            </h2>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Konfigurasi batas waktu ambang kedaluwarsa, aturan otomatisasi rebalance antar gudang, dan notifikasi alert.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="glass-card" style={{ borderRadius: '24px', padding: '28px', maxWidth: '800px' }}>
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Expiry Threshold Rules */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Aturan Ambang Batas Kedaluwarsa (Shelf-Life Thresholds)
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Tentukan jumlah hari sebelum tanggal kedaluwarsa untuk memicu status Kritis dan Dekat Expiry.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#EF4444', display: 'block', marginBottom: '6px' }}>
                  Batas Status Kritis (Critical Alert)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    value={criticalDays}
                    onChange={(e) => setCriticalDays(e.target.value)}
                    className="input-control"
                    style={{ width: '120px' }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Hari sebelum Expired</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#F59E0B', display: 'block', marginBottom: '6px' }}>
                  Batas Status Peringatan (Near Expiry)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    value={nearExpiryDays}
                    onChange={(e) => setNearExpiryDays(e.target.value)}
                    className="input-control"
                    style={{ width: '120px' }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Hari sebelum Expired</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Section 2: Automation Rules */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Otomasi Alokasi & Rekomendasi
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Opsi otomatisasi rekomendasi transfer antar gudang dan broadcast alert.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoRebalance}
                  onChange={(e) => setAutoRebalance(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#00529b' }}
                />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                    Aktifkan Rekomendasi Mutasi Antar Gudang Otomatis
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Sistem akan menyarankan transfer batch kritis dari gudang lambat ke gudang cepat.
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#00529b' }}
                />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                    Kirim Notifikasi Alert ke PIC Kepala Gudang
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Kirim ringkasan batch yang perlu dikeluarkan setiap pukul 07:00 WIB.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#00529b' }}>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
