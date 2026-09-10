'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { QuickActionModal } from '@/components/ui/QuickActionModal';
import { Transaction } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onAddTransaction: (tx: Transaction) => void;
  onOpenNewOrderModal: () => void;
  isNewOrderModalOpen: boolean;
  setIsNewOrderModalOpen: (open: boolean) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onSelectTab,
  onAddTransaction,
  onOpenNewOrderModal,
  isNewOrderModalOpen,
  setIsNewOrderModalOpen,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className={`main-content-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNewOrderModal={onOpenNewOrderModal}
          onNavigateTab={onSelectTab}
        />

        <main className="dashboard-page-body">{children}</main>
      </div>

      {/* Global Command Palette Modal (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenNewOrderModal={onOpenNewOrderModal}
      />

      {/* Quick Action Order Modal */}
      <QuickActionModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onAddTransaction={onAddTransaction}
      />
    </div>
  );
};
