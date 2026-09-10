'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/context/ToastContext';
import {
  Search,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  PlusCircle,
  Download,
  Moon,
  Sun,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewOrderModal?: () => void;
}

interface CommandOption {
  id: string;
  title: string;
  category: 'Navigasi' | 'Aksi Cepat' | 'Laporan & Dokumen';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onOpenNewOrderModal }) => {
  const { showToast } = useToast();
  const { toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or custom state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commandItems: CommandOption[] = useMemo(
    () => [
      {
        id: 'cmd-1',
        title: 'Buat Sales Order / Kontrak Baru',
        category: 'Aksi Cepat',
        icon: <PlusCircle size={16} color="#10B981" />,
        action: () => {
          onClose();
          if (onOpenNewOrderModal) onOpenNewOrderModal();
        },
      },
      {
        id: 'cmd-2',
        title: 'Beralih Tema (Dark / Light Mode)',
        category: 'Aksi Cepat',
        icon: <Moon size={16} color="#8B5CF6" />,
        action: () => {
          toggleTheme();
          showToast('Mode tema berhasil dialihkan!', 'info', 'Tema Diperbarui');
          onClose();
        },
      },
      {
        id: 'cmd-3',
        title: 'Export Laporan Keuangan Bulanan',
        category: 'Laporan & Dokumen',
        icon: <Download size={16} color="#3B82F6" />,
        action: () => {
          showToast('Mempersiapkan dokumen PDF Laporan Keuangan...', 'info', 'Export Laporan');
          onClose();
        },
      },
      {
        id: 'cmd-4',
        title: 'Buka Dashboard Overview',
        category: 'Navigasi',
        icon: <LayoutDashboard size={16} color="#6366F1" />,
        action: () => {
          showToast('Navigasi ke Dashboard Overview', 'info');
          onClose();
        },
      },
      {
        id: 'cmd-5',
        title: 'Buka Modul Warehouse & Inventory',
        category: 'Navigasi',
        icon: <Package size={16} color="#F59E0B" />,
        action: () => {
          showToast('Navigasi ke Modul Warehouse & Inventory', 'info');
          onClose();
        },
      },
      {
        id: 'cmd-6',
        title: 'Buka Daftar Klien & CRM Enterprise',
        category: 'Navigasi',
        icon: <Users size={16} color="#EC4899" />,
        action: () => {
          showToast('Navigasi ke Modul CRM Enterprise', 'info');
          onClose();
        },
      },
      {
        id: 'cmd-7',
        title: 'Pengaturan Sistem & Hak Akses',
        category: 'Navigasi',
        icon: <Settings size={16} color="#64748B" />,
        action: () => {
          showToast('Navigasi ke Pengaturan Sistem', 'info');
          onClose();
        },
      },
    ],
    [onClose, onOpenNewOrderModal, toggleTheme, showToast]
  );

  const filteredItems = useMemo(() => {
    if (!query) return commandItems;
    return commandItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [commandItems, query]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-card"
        style={{
          width: '580px',
          maxWidth: '100%',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input in modal header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={20} style={{ color: 'var(--primary)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik perintah atau cari modul, dokumen, aksi..."
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
          <div
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface-elevated)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            ESC
          </div>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '12px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={item.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: selectedIndex === idx ? 'var(--bg-surface-elevated)' : 'transparent',
                  transition: 'background-color var(--transition-fast)',
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
                  </div>
                </div>

                <CornerDownLeft size={14} style={{ color: 'var(--text-muted)', opacity: selectedIndex === idx ? 1 : 0 }} />
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>Pintasan Cepat: HashMicro Enterprise Command Engine</span>
          <span>Tekan ↵ untuk memilih</span>
        </div>
      </div>
    </div>
  );
};
