export type ThemeMode = 'light' | 'dark';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'danger';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// ==========================================
// 1. MASTER TABLES (ERD SPECIFICATION)
// ==========================================

export interface Category {
  category_id: number;
  name: string;
  description: string;
}

export interface Product {
  product_id: number;
  category_id: number;
  name: string;
  description: string;
  uom: string; // e.g. Karton, Pcs, Liter
  min_stock_level: number;
  // Joined / UI Helpers
  category_name?: string;
  sku?: string;
  unit_price?: number;
}

export interface Batch {
  batch_id: number;
  product_id: number;
  batch_no: string;
  production_date: string; // YYYY-MM-DD
  expiry_date: string; // YYYY-MM-DD
  status: 'fresh' | 'near_expiry' | 'critical' | 'expired';
  // Joined / UI Helpers
  product_name?: string;
  sku?: string;
  uom?: string;
  days_to_expiry?: number;
}

export interface Warehouse {
  warehouse_id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  // UI Helpers
  code: string;
  capacity: number;
  current_stock: number;
  color: string;
}

export interface Inventory {
  inventory_id: number;
  warehouse_id: number;
  batch_id: number;
  quantity: number;
}

// Joined View for easy FEFO Table Rendering
export interface InventoryItem {
  inventory_id: number;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_code: string;
  batch_id: number;
  batch_number: string;
  product_id: number;
  product_name: string;
  sku: string;
  category_name: string;
  quantity: number;
  uom: string;
  production_date: string;
  expiry_date: string;
  days_to_expiry: number;
  expiry_status: 'fresh' | 'near_expiry' | 'critical' | 'expired';
  fefo_priority: number; // 1 = highest priority (earliest expiry)
}

// ==========================================
// 2. INBOUND (Barang Masuk / Pembelian)
// ==========================================

export interface GoodsReceipt {
  receipt_id: number;
  warehouse_id: number;
  receipt_no: string;
  receipt_date: string;
  status: 'COMPLETED' | 'DRAFT' | 'CANCELLED';
  // Joined / UI Helpers
  warehouse_name?: string;
  total_items?: number;
  total_amount?: number;
  details?: GoodsReceiptDetail[];
}

export interface GoodsReceiptDetail {
  receipt_detail_id: number;
  receipt_id: number;
  batch_id: number;
  quantity: number;
  unit_price: number;
  // Joined / UI Helpers
  batch_no?: string;
  product_name?: string;
  uom?: string;
}

// ==========================================
// 3. OUTBOUND (Barang Keluar / Penjualan / Produksi)
// ==========================================

export interface GoodsIssue {
  issue_id: number;
  warehouse_id: number;
  issue_no: string;
  issue_date: string;
  status: 'COMPLETED' | 'PENDING' | 'DISPATCHED' | 'CANCELLED';
  // Joined / UI Helpers
  warehouse_name?: string;
  destination_client?: string;
  total_quantity?: number;
  details?: GoodsIssueDetail[];
}

export interface GoodsIssueDetail {
  issue_detail_id: number;
  issue_id: number;
  batch_id: number;
  quantity: number;
  // Joined / UI Helpers
  batch_no?: string;
  product_name?: string;
  uom?: string;
}

// ==========================================
// 4. STOCK LEDGER / PERGERAKAN STOK
// ==========================================

export type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';

export interface StockMovement {
  movement_id: number;
  batch_id: number;
  source_warehouse_id?: number | null;
  destination_warehouse_id?: number | null;
  movement_type: MovementType;
  quantity: number;
  movement_date: string;
  created_by: string;
  notes?: string;
  // Joined / UI Helpers
  batch_number?: string;
  product_name?: string;
  uom?: string;
  source_warehouse_name?: string;
  destination_warehouse_name?: string;
  reference_no?: string;
}

// ==========================================
// 5. UI UTILITY TYPES
// ==========================================

export interface MonthlyFlow {
  month: string;
  incoming: number;
  outgoing: number;
}

export interface MetricItem {
  id: string;
  title: string;
  value: string;
  change: string;
  changePercent: string;
  timeframe?: string;
  isPositive: boolean;
  sparklineData: number[];
  sparkline?: number[];
  iconName: string;
  color: string;
  subtext: string;
}

export interface ChartDataPoint {
  label: string;
  revenue: number;
  expenses: number;
  orders: number;
  target: number;
}

export interface CategoryShare {
  name: string;
  value: number;
  percentage: number;
  color: string;
  growth: string;
}

export type StatusType = 'completed' | 'processing' | 'pending' | 'failed' | 'shipped' | 'cancelled';

export interface Transaction {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  product: string;
  amount: number;
  currency: string;
  date: string;
  status: StatusType;
  paymentMethod: string;
  itemsCount: number;
  shippingCity: string;
}
