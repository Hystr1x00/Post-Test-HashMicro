'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { Search, Bell, Moon, Sun, Menu, ChevronDown } from 'lucide-react';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenNewOrderModal?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  onOpenCommandPalette,
  onNavigateTab,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header
      style={{
        height: '76px',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'relative',
      }}
    >
      {/* Left: Title & Date */}
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Stock & FEFO Report
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 500 }}>
          Friday, December 15th 2026 • PT. Ultra Jaya Manufacturing
        </p>
      </div>

      {/* Right Controls: Search Icon, Bell, Theme, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
        {/* Search button */}
        <button
          onClick={onOpenCommandPalette}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease',
          }}
          title="Pencarian Cepat (Ctrl+K)"
        >
          <Search size={18} />
        </button>

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: isNotifOpen ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
              border: isNotifOpen ? '1px solid #00529b' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isNotifOpen ? '#00529b' : 'var(--text-secondary)',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
            title="Pusat Peringatan & Rekomendasi Stok"
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#ffffff',
                fontSize: '0.625rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-surface)',
              }}
            >
              3
            </span>
          </button>

          {/* Dropdown Menu */}
          <NotificationDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            onNavigateTab={onNavigateTab}
          />
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Ganti Tema"
        >
          {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#00529b" />}
        </button>

        {/* User Profile: Head of Supply Chain & Warehouse */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 14px 4px 4px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces"
            alt="Farid Ghani"
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Farid Ghani
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#00529b' }}>
              Head of Supply Chain & Warehouse
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
