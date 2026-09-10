'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DealDeckCards } from '@/components/ui/DealDeckCards';
import { ConcentricArcChart } from '@/components/ui/ConcentricArcChart';
import { StockFlowBarChart } from '@/components/ui/StockFlowBarChart';
import { WarehouseBubbleChart } from '@/components/ui/WarehouseBubbleChart';
import { FEFOInsightsSection } from '@/components/ui/FEFOInsightsSection';
import { FEFODispatchTable } from '@/components/ui/FEFODispatchTable';
import { ExecutiveDashboardPage } from '@/components/pages/ExecutiveDashboardPage';
import { InboundReceiptsPage } from '@/components/pages/InboundReceiptsPage';
import { OutboundIssuesPage } from '@/components/pages/OutboundIssuesPage';
import { StockMovementsPage } from '@/components/pages/StockMovementsPage';
import { BatchesInventoryPage } from '@/components/pages/BatchesInventoryPage';
import { ProductsPage } from '@/components/pages/ProductsPage';
import { WarehousesPage } from '@/components/pages/WarehousesPage';
import { SchemaERDPage } from '@/components/pages/SchemaERDPage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { INVENTORY_FEFO_ITEMS, GOODS_RECEIPTS, GOODS_ISSUES } from '@/data/mockData';
import { InventoryItem, GoodsReceipt, GoodsIssue } from '@/types';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INVENTORY_FEFO_ITEMS);
  const [receipts, setReceipts] = useState<GoodsReceipt[]>(GOODS_RECEIPTS);
  const [issues, setIssues] = useState<GoodsIssue[]>(GOODS_ISSUES);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // Handle successful FEFO Dispatch
  const handleDispatchSuccess = (inventoryId: number, dispatchedQty: number) => {
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.inventory_id === inventoryId
          ? {
              ...item,
              quantity: Math.max(0, item.quantity - dispatchedQty),
            }
          : item
      )
    );
  };

  const handleAddReceipt = (newReceipt: GoodsReceipt) => {
    setReceipts([newReceipt, ...receipts]);
  };

  const handleAddIssue = (newIssue: GoodsIssue) => {
    setIssues([newIssue, ...issues]);
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onAddTransaction={() => {}}
      onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
      isNewOrderModalOpen={isNewOrderModalOpen}
      setIsNewOrderModalOpen={setIsNewOrderModalOpen}
    >
      {/* 1. Executive Operations Dashboard */}
      {activeTab === 'dashboard' && <ExecutiveDashboardPage onNavigate={setActiveTab} />}

      {/* 2. Stock & FEFO Analytical Report */}
      {activeTab === 'report' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Section: 4 KPI Cards (Left) + Concentric Arc Gauge (Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '20px',
              alignItems: 'stretch',
            }}
          >
            <DealDeckCards />
            <ConcentricArcChart />
          </div>

          {/* Middle Section: Stock Movement Bar Chart (Left) + Warehouse Bubbles (Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '20px',
              alignItems: 'stretch',
            }}
          >
            <StockFlowBarChart />
            <WarehouseBubbleChart />
          </div>

          {/* Insightful FEFO Intelligence & Operational Impact Section */}
          <FEFOInsightsSection />

          {/* Real-time FEFO Batch Dispatch & Traceability Table */}
          <div style={{ marginTop: '4px' }}>
            <FEFODispatchTable
              items={inventoryItems}
              onDispatchSuccess={handleDispatchSuccess}
            />
          </div>
        </div>
      )}

      {/* 3. Inbound (Goods Receipts - Barang Masuk) */}
      {activeTab === 'inbound' && (
        <InboundReceiptsPage
          receipts={receipts}
          onAddReceipt={handleAddReceipt}
        />
      )}

      {/* 4. Outbound (Goods Issues - Barang Keluar) */}
      {activeTab === 'outbound' && (
        <OutboundIssuesPage
          issues={issues}
          onAddIssue={handleAddIssue}
          inventoryItems={inventoryItems}
        />
      )}

      {/* 5. Stock Ledger (stock_movements) */}
      {activeTab === 'movements' && <StockMovementsPage />}

      {/* 6. Inventory & Batches Master (inventory & batches) */}
      {activeTab === 'inventory' && <BatchesInventoryPage />}

      {/* 7. Master Products & Categories (products & categories) */}
      {activeTab === 'products' && <ProductsPage />}

      {/* 8. Multi-Warehouse Hubs (warehouses) */}
      {activeTab === 'warehouses' && <WarehousesPage />}

      {/* 9. ERD & DBML Architecture Explorer */}
      {activeTab === 'erd' && <SchemaERDPage />}

      {/* 10. Settings Page */}
      {activeTab === 'settings' && <SettingsPage />}
    </DashboardLayout>
  );
}
