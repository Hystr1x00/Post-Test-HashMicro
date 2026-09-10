'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Package,
  Building2,
  CreditCard,
  Settings,
  HelpCircle,
  Zap,
  Sliders,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Layers,
  Database,
} from 'lucide-react';
import { UltrajayaLogo } from '@/components/ui/UltrajayaLogo';
import { useToast } from '@/context/ToastContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const { showToast } = useToast();
  const [isAutoFefoActive, setIsAutoFefoActive] = useState(true);
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);

  const menuSections = [
    {
      title: 'OPERATIONS & REPORT',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'report', label: 'Stock & FEFO Report', icon: FileText },
      ],
    },
    {
      title: 'ERD TRANSACTIONS',
      items: [
        { id: 'inbound', label: '1. Inbound (Goods Receipts)', icon: ArrowDownLeft, badge: 'IN' },
        { id: 'outbound', label: '2. Outbound (Goods Issues)', icon: ArrowUpRight, badge: 'OUT' },
        { id: 'movements', label: '3. Stock Ledger (Movements)', icon: CreditCard },
        { id: 'inventory', label: 'Inventory & Batches', icon: Layers },
      ],
    },
    {
      title: 'MASTER DATA',
      items: [
        { id: 'products', label: 'Products & Categories', icon: Package },
        { id: 'warehouses', label: 'Multi-Warehouse', icon: Building2 },
      ],
    },
    {
      title: 'SYSTEM & ARCHITECTURE',
      items: [
        { id: 'erd', label: 'ERD & DBML Schema', icon: Database, badge: 'New' },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleToggleAutoFefo = () => {
    const nextState = !isAutoFefoActive;
    setIsAutoFefoActive(nextState);
    showToast(
      nextState
        ? 'FEFO Auto-Pilot Engine DIAKTIFKAN: Semua Outbound Goods Issues otomatis dialokasikan ke batch terdekat expiry.'
        : 'FEFO Auto-Pilot Engine DINONAKTIFKAN: Mode alokasi batch beralih ke manual.',
      nextState ? 'success' : 'warning',
      nextState ? 'Auto-FEFO Aktif' : 'Mode Manual'
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 16px',
          justifyContent: 'space-between',
          transition: 'width var(--transition-smooth)',
          overflowY: 'auto',
        }}
      >
        {/* Top Logo */}
        <div>
          <div style={{ padding: '4px 8px 20px' }}>
            <UltrajayaLogo collapsed={collapsed} />
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {menuSections.map((section) => (
              <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {!collapsed && (
                  <div
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.06em',
                      padding: '0 8px 4px',
                    }}
                  >
                    {section.title}
                  </div>
                )}

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isActive ? '#00529b' : 'transparent',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        width: '100%',
                        textAlign: 'left',
                        boxShadow: 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={17} color={isActive ? '#ffffff' : 'currentColor'} />
                        {!collapsed && <span>{item.label}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '6px',
                            backgroundColor: isActive
                              ? 'rgba(255, 255, 255, 0.25)'
                              : item.badge === 'IN'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : item.badge === 'OUT'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(0, 82, 155, 0.15)',
                            color: isActive
                              ? '#ffffff'
                              : item.badge === 'IN'
                              ? '#10B981'
                              : item.badge === 'OUT'
                              ? '#EF4444'
                              : '#00529b',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom FEFO Engine Status Card */}
        {!collapsed && (
          <div
            style={{
              backgroundColor: isAutoFefoActive ? '#07152b' : '#0f172a',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: isAutoFefoActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Zap size={13} color={isAutoFefoActive ? '#10B981' : '#EF4444'} />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>
                  FEFO Auto Engine
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 800,
                  padding: '2px 5px',
                  borderRadius: '8px',
                  backgroundColor: isAutoFefoActive ? '#10B981' : '#EF4444',
                  color: '#ffffff',
                }}
              >
                {isAutoFefoActive ? 'AKTIF' : 'OFF'}
              </span>
            </div>

            <p style={{ fontSize: '0.6875rem', color: '#94A3B8', lineHeight: 1.3 }}>
              {isAutoFefoActive
                ? 'Outbound otomatis merekomendasikan batch terdekat kedaluwarsa.'
                : 'Mode manual aktif untuk pemilihan nomor batch.'}
            </p>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleToggleAutoFefo}
                className="btn"
                style={{
                  flex: 1,
                  background: isAutoFefoActive ? 'linear-gradient(135deg, #00529b 0%, #0077c8 100%)' : '#10B981',
                  color: '#ffffff',
                  padding: '5px',
                  borderRadius: '8px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  border: 'none',
                }}
              >
                {isAutoFefoActive ? 'Nonaktifkan' : 'Aktifkan'}
              </button>

              <button
                onClick={() => setIsEngineModalOpen(true)}
                className="btn btn-secondary"
                style={{
                  padding: '5px 8px',
                  borderRadius: '8px',
                  fontSize: '0.6875rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: 'none',
                }}
                title="Konfigurasi Engine"
              >
                <Sliders size={12} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* FEFO Engine Details Modal */}
      {isEngineModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEngineModalOpen(false)}>
          <div
            className="glass-card"
            style={{
              width: '480px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="#00529b" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Konfigurasi FEFO Engine</h3>
              </div>
              <button onClick={() => setIsEngineModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              FEFO Auto-Engine memastikan rotasi batch sesuai ERD <code>batches.expiry_date ASC</code> dan <code>inventory.quantity</code>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Alokasi Outbound (goods_issues)</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Urutan otomatis berdasarkan `expiry_date ASC`</div>
                </div>
                <span className="badge badge-success">Aktif</span>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Quarantine Threshold</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Kunci batch otomatis jika sisa umur &le; 7 hari</div>
                </div>
                <span style={{ fontWeight: 700, color: '#EF4444' }}>7 Hari</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button onClick={() => setIsEngineModalOpen(false)} className="btn btn-primary">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
