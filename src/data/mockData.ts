import {
  Category,
  Product,
  Batch,
  Warehouse,
  Inventory,
  InventoryItem,
  GoodsReceipt,
  GoodsReceiptDetail,
  GoodsIssue,
  GoodsIssueDetail,
  StockMovement,
  MonthlyFlow,
} from '@/types';

// ==========================================
// 1. MASTER TABLES
// ==========================================

export const CATEGORIES: Category[] = [
  { category_id: 1, name: 'Susu UHT & Dairy', description: 'Produk olahan susu steril kemasan aseptik Tetra Pak' },
  { category_id: 2, name: 'RTD Tea Beverage', description: 'Minuman teh segar dalam kemasan kotak karton' },
  { category_id: 3, name: 'Healthy & Traditional', description: 'Minuman sari kacang hijau dan herbal alami berkhasiat' },
  { category_id: 4, name: 'Kids Nutrition', description: 'Varian nutrisi khusus anak dengan vitamin & kalsium tinggi' },
];

export const PRODUCTS: Product[] = [
  {
    product_id: 101,
    category_id: 1,
    category_name: 'Susu UHT & Dairy',
    sku: 'UM-FC-1000',
    name: 'Ultra Milk Full Cream 1000ml',
    description: 'Susu cair segar UHT kemasan 1 Liter Tetra Pak',
    uom: 'Karton (12 pcs)',
    min_stock_level: 500,
  },
  {
    product_id: 102,
    category_id: 1,
    category_name: 'Susu UHT & Dairy',
    sku: 'UM-CH-250',
    name: 'Ultra Milk Cokelat 250ml',
    description: 'Susu UHT rasa cokelat favorit kemasan 250ml',
    uom: 'Karton (24 pcs)',
    min_stock_level: 800,
  },
  {
    product_id: 103,
    category_id: 2,
    category_name: 'RTD Tea Beverage',
    sku: 'TK-JAS-300',
    name: 'Teh Kotak Jasmine 300ml',
    description: 'Teh melati seduh alami kemasan Tetra Brik 300ml',
    uom: 'Karton (24 pcs)',
    min_stock_level: 600,
  },
  {
    product_id: 104,
    category_id: 3,
    category_name: 'Healthy & Traditional',
    sku: 'SKI-ORI-250',
    name: 'Sari Kacang Ijo 250ml',
    description: 'Minuman sari kacang hijau dengan jahe dan gula kelapa alami',
    uom: 'Karton (24 pcs)',
    min_stock_level: 400,
  },
  {
    product_id: 105,
    category_id: 4,
    category_name: 'Kids Nutrition',
    sku: 'MM-VN-125',
    name: 'Ultra Mimi Kids Vanilla 125ml',
    description: 'Susu UHT bernutrisi tinggi khusus balita kemasan mini pack',
    uom: 'Karton (40 pcs)',
    min_stock_level: 450,
  },
  {
    product_id: 106,
    category_id: 1,
    category_name: 'Susu UHT & Dairy',
    sku: 'UM-ST-250',
    name: 'Ultra Milk Strawberry 250ml',
    description: 'Susu UHT rasa stroberi segar kemasan 250ml',
    uom: 'Karton (24 pcs)',
    min_stock_level: 500,
  },
];

export const BATCHES: Batch[] = [
  {
    batch_id: 1001,
    product_id: 102,
    product_name: 'Ultra Milk Cokelat 250ml',
    batch_no: 'BTH-202607-001',
    production_date: '2026-07-10',
    expiry_date: '2026-09-28',
    status: 'critical',
    uom: 'Karton (24 pcs)',
    days_to_expiry: 18,
  },
  {
    batch_id: 1002,
    product_id: 104,
    product_name: 'Sari Kacang Ijo 250ml',
    batch_no: 'BTH-202607-014',
    production_date: '2026-07-15',
    expiry_date: '2026-10-04',
    status: 'critical',
    uom: 'Karton (24 pcs)',
    days_to_expiry: 24,
  },
  {
    batch_id: 1003,
    product_id: 101,
    product_name: 'Ultra Milk Full Cream 1000ml',
    batch_no: 'BTH-202608-005',
    production_date: '2026-08-01',
    expiry_date: '2026-10-22',
    status: 'near_expiry',
    uom: 'Karton (12 pcs)',
    days_to_expiry: 42,
  },
  {
    batch_id: 1004,
    product_id: 103,
    product_name: 'Teh Kotak Jasmine 300ml',
    batch_no: 'BTH-202608-019',
    production_date: '2026-08-10',
    expiry_date: '2026-11-05',
    status: 'near_expiry',
    uom: 'Karton (24 pcs)',
    days_to_expiry: 56,
  },
  {
    batch_id: 1005,
    product_id: 105,
    product_name: 'Ultra Mimi Kids Vanilla 125ml',
    batch_no: 'BTH-202608-030',
    production_date: '2026-08-25',
    expiry_date: '2026-12-15',
    status: 'fresh',
    uom: 'Karton (40 pcs)',
    days_to_expiry: 96,
  },
  {
    batch_id: 1006,
    product_id: 101,
    product_name: 'Ultra Milk Full Cream 1000ml',
    batch_no: 'BTH-202609-002',
    production_date: '2026-09-02',
    expiry_date: '2027-01-20',
    status: 'fresh',
    uom: 'Karton (12 pcs)',
    days_to_expiry: 132,
  },
  {
    batch_id: 1007,
    product_id: 103,
    product_name: 'Teh Kotak Jasmine 300ml',
    batch_no: 'BTH-202609-008',
    production_date: '2026-09-05',
    expiry_date: '2027-02-14',
    status: 'fresh',
    uom: 'Karton (24 pcs)',
    days_to_expiry: 157,
  },
  {
    batch_id: 1008,
    product_id: 106,
    product_name: 'Ultra Milk Strawberry 250ml',
    batch_no: 'BTH-202609-012',
    production_date: '2026-09-08',
    expiry_date: '2027-03-10',
    status: 'fresh',
    uom: 'Karton (24 pcs)',
    days_to_expiry: 181,
  },
];

export const WAREHOUSES: Warehouse[] = [
  {
    warehouse_id: 1,
    name: 'Cikarang Central Plant Warehouse',
    location: 'Kawasan Industri MM2100, Cikarang Barat, Bekasi',
    status: 'active',
    code: 'WH-CKR-01',
    capacity: 10000,
    current_stock: 4280,
    color: '#00529b', // Ultrajaya Navy Blue
  },
  {
    warehouse_id: 2,
    name: 'Surabaya Distribution Hub',
    location: 'Rungkut Industri III No. 45, Surabaya, Jawa Timur',
    status: 'active',
    code: 'WH-SBY-02',
    capacity: 6000,
    current_stock: 2417,
    color: '#06B6D4', // Cyan
  },
  {
    warehouse_id: 3,
    name: 'Bandung Regional Depo',
    location: 'Jl. Raya Padalarang No. 88, Kab. Bandung Barat',
    status: 'active',
    code: 'WH-BDG-03',
    capacity: 5000,
    current_stock: 2281,
    color: '#8B5CF6', // Purple
  },
  {
    warehouse_id: 4,
    name: 'Medan Outer Transit Hub',
    location: 'Kawasan Industri Medan (KIM) 2, Deli Serdang, Sumut',
    status: 'active',
    code: 'WH-MDN-04',
    capacity: 3000,
    current_stock: 812,
    color: '#F59E0B', // Amber
  },
];

export const INVENTORY: Inventory[] = [
  { inventory_id: 1, warehouse_id: 1, batch_id: 1001, quantity: 340 },
  { inventory_id: 2, warehouse_id: 2, batch_id: 1002, quantity: 210 },
  { inventory_id: 3, warehouse_id: 1, batch_id: 1003, quantity: 650 },
  { inventory_id: 4, warehouse_id: 3, batch_id: 1004, quantity: 580 },
  { inventory_id: 5, warehouse_id: 1, batch_id: 1005, quantity: 820 },
  { inventory_id: 6, warehouse_id: 2, batch_id: 1006, quantity: 1420 },
  { inventory_id: 7, warehouse_id: 4, batch_id: 1007, quantity: 450 },
  { inventory_id: 8, warehouse_id: 3, batch_id: 1008, quantity: 520 },
];

// Helper to construct joined FEFO inventory items
export const buildInventoryFefoItems = (
  invList: Inventory[],
  batchesList: Batch[],
  productsList: Product[],
  warehousesList: Warehouse[]
): InventoryItem[] => {
  return invList
    .map((inv) => {
      const batch = batchesList.find((b) => b.batch_id === inv.batch_id);
      const warehouse = warehousesList.find((w) => w.warehouse_id === inv.warehouse_id);
      const product = productsList.find((p) => p.product_id === batch?.product_id);

      const days = batch?.days_to_expiry ?? 90;
      let expiryStatus: 'fresh' | 'near_expiry' | 'critical' | 'expired' = 'fresh';
      if (days <= 0) expiryStatus = 'expired';
      else if (days <= 30) expiryStatus = 'critical';
      else if (days <= 60) expiryStatus = 'near_expiry';

      return {
        inventory_id: inv.inventory_id,
        warehouse_id: inv.warehouse_id,
        warehouse_name: warehouse?.name || 'Gudang',
        warehouse_code: warehouse?.code || `WH-${inv.warehouse_id}`,
        batch_id: inv.batch_id,
        batch_number: batch?.batch_no || 'UNKNOWN-BATCH',
        product_id: product?.product_id || 0,
        product_name: product?.name || 'Produk',
        sku: product?.sku || 'SKU-000',
        category_name: product?.category_name || 'Kategori',
        quantity: inv.quantity,
        uom: product?.uom || 'Karton',
        production_date: batch?.production_date || '2026-01-01',
        expiry_date: batch?.expiry_date || '2026-12-31',
        days_to_expiry: days,
        expiry_status: expiryStatus,
        fefo_priority: 1, // calculated dynamically below
      };
    })
    .sort((a, b) => a.days_to_expiry - b.days_to_expiry)
    .map((item, index) => ({
      ...item,
      fefo_priority: index + 1,
    }));
};

export const INVENTORY_FEFO_ITEMS: InventoryItem[] = buildInventoryFefoItems(
  INVENTORY,
  BATCHES,
  PRODUCTS,
  WAREHOUSES
);

// ==========================================
// 2. INBOUND (Barang Masuk / Pembelian / Produksi)
// ==========================================

export const GOODS_RECEIPTS: GoodsReceipt[] = [
  {
    receipt_id: 501,
    warehouse_id: 1,
    warehouse_name: 'Cikarang Central Plant Warehouse',
    receipt_no: 'GR-2026-0901',
    receipt_date: '2026-09-08 10:00',
    status: 'COMPLETED',
    total_items: 1500,
    total_amount: 367500000,
    details: [
      {
        receipt_detail_id: 5001,
        receipt_id: 501,
        batch_id: 1006,
        batch_no: 'BTH-202609-002',
        product_name: 'Ultra Milk Full Cream 1000ml',
        uom: 'Karton (12 pcs)',
        quantity: 1500,
        unit_price: 245000,
      },
    ],
  },
  {
    receipt_id: 502,
    warehouse_id: 3,
    warehouse_name: 'Bandung Regional Depo',
    receipt_no: 'GR-2026-0902',
    receipt_date: '2026-09-08 14:30',
    status: 'COMPLETED',
    total_items: 520,
    total_amount: 87360000,
    details: [
      {
        receipt_detail_id: 5002,
        receipt_id: 502,
        batch_id: 1008,
        batch_no: 'BTH-202609-012',
        product_name: 'Ultra Milk Strawberry 250ml',
        uom: 'Karton (24 pcs)',
        quantity: 520,
        unit_price: 168000,
      },
    ],
  },
  {
    receipt_id: 503,
    warehouse_id: 1,
    warehouse_name: 'Cikarang Central Plant Warehouse',
    receipt_no: 'GR-2026-0903',
    receipt_date: '2026-09-09 07:15',
    status: 'DRAFT',
    total_items: 800,
    total_amount: 108000000,
    details: [
      {
        receipt_detail_id: 5003,
        receipt_id: 503,
        batch_id: 1007,
        batch_no: 'BTH-202609-008',
        product_name: 'Teh Kotak Jasmine 300ml',
        uom: 'Karton (24 pcs)',
        quantity: 800,
        unit_price: 135000,
      },
    ],
  },
];

export const GOODS_RECEIPT_DETAILS: GoodsReceiptDetail[] = GOODS_RECEIPTS.flatMap((gr) => gr.details || []);

// ==========================================
// 3. OUTBOUND (Barang Keluar / Penjualan / Distribusi)
// ==========================================

export const GOODS_ISSUES: GoodsIssue[] = [
  {
    issue_id: 601,
    warehouse_id: 1,
    warehouse_name: 'Cikarang Central Plant Warehouse',
    destination_client: 'PT. Indomarco Prismatama (Indomaret Hub Jabar)',
    issue_no: 'GI-2026-0901',
    issue_date: '2026-09-09 08:30',
    status: 'COMPLETED',
    total_quantity: 150,
    details: [
      {
        issue_detail_id: 6001,
        issue_id: 601,
        batch_id: 1001,
        batch_no: 'BTH-202607-001',
        product_name: 'Ultra Milk Cokelat 250ml',
        uom: 'Karton (24 pcs)',
        quantity: 150,
      },
    ],
  },
  {
    issue_id: 602,
    warehouse_id: 2,
    warehouse_name: 'Surabaya Distribution Hub',
    destination_client: 'PT. Sumber Alfaria Trijaya (Alfamart Surabaya)',
    issue_no: 'GI-2026-0902',
    issue_date: '2026-09-09 11:00',
    status: 'COMPLETED',
    total_quantity: 120,
    details: [
      {
        issue_detail_id: 6002,
        issue_id: 602,
        batch_id: 1002,
        batch_no: 'BTH-202607-014',
        product_name: 'Sari Kacang Ijo 250ml',
        uom: 'Karton (24 pcs)',
        quantity: 120,
      },
    ],
  },
  {
    issue_id: 603,
    warehouse_id: 1,
    warehouse_name: 'Cikarang Central Plant Warehouse',
    destination_client: 'Lion Superindo Modern Retail HQ',
    issue_no: 'GI-2026-0903',
    issue_date: '2026-09-10 09:45',
    status: 'DISPATCHED',
    total_quantity: 250,
    details: [
      {
        issue_detail_id: 6003,
        issue_id: 603,
        batch_id: 1003,
        batch_no: 'BTH-202608-005',
        product_name: 'Ultra Milk Full Cream 1000ml',
        uom: 'Karton (12 pcs)',
        quantity: 250,
      },
    ],
  },
];

export const GOODS_ISSUE_DETAILS: GoodsIssueDetail[] = GOODS_ISSUES.flatMap((gi) => gi.details || []);

// ==========================================
// 4. STOCK LEDGER / PERGERAKAN STOK
// ==========================================

export const STOCK_MOVEMENTS: StockMovement[] = [
  {
    movement_id: 901,
    batch_id: 1006,
    batch_number: 'BTH-202609-002',
    product_name: 'Ultra Milk Full Cream 1000ml',
    uom: 'Karton',
    source_warehouse_id: null,
    destination_warehouse_id: 1,
    source_warehouse_name: 'Pabrik Lini Produksi Tetra Pak A',
    destination_warehouse_name: 'Cikarang Central Plant Warehouse',
    movement_type: 'IN',
    quantity: 1500,
    movement_date: '2026-09-08 10:00',
    created_by: 'Siti Rahmawati (QA & Inbound PIC)',
    notes: 'Finished Goods Inbound dari GR-2026-0901',
  },
  {
    movement_id: 902,
    batch_id: 1005,
    batch_number: 'BTH-202608-030',
    product_name: 'Ultra Mimi Kids Vanilla 125ml',
    uom: 'Karton',
    source_warehouse_id: 1,
    destination_warehouse_id: 2,
    source_warehouse_name: 'Cikarang Central Plant Warehouse',
    destination_warehouse_name: 'Surabaya Distribution Hub',
    movement_type: 'TRANSFER',
    quantity: 200,
    movement_date: '2026-09-08 14:15',
    created_by: 'Farid Ghani (Logistics Lead)',
    notes: 'Inter-Warehouse Stock Balancing Jawa Timur (TR-2026-0902)',
  },
  {
    movement_id: 903,
    batch_id: 1001,
    batch_number: 'BTH-202607-001',
    product_name: 'Ultra Milk Cokelat 250ml',
    uom: 'Karton',
    source_warehouse_id: 1,
    destination_warehouse_id: null,
    source_warehouse_name: 'Cikarang Central Plant Warehouse',
    destination_warehouse_name: 'PT. Indomarco Prismatama',
    movement_type: 'OUT',
    quantity: 150,
    movement_date: '2026-09-09 08:30',
    created_by: 'Budi Santoso (Warehouse Supervisor)',
    notes: 'Outbound Dispatch GI-2026-0901 (Alokasi FEFO Priority #1)',
  },
  {
    movement_id: 904,
    batch_id: 1007,
    batch_number: 'BTH-202609-008',
    product_name: 'Teh Kotak Jasmine 300ml',
    uom: 'Karton',
    source_warehouse_id: 1,
    destination_warehouse_id: 4,
    source_warehouse_name: 'Cikarang Central Plant Warehouse',
    destination_warehouse_name: 'Medan Outer Transit Hub',
    movement_type: 'TRANSFER',
    quantity: 450,
    movement_date: '2026-09-09 16:20',
    created_by: 'Farid Ghani (Logistics Lead)',
    notes: 'Regional Stock Replenishment Sumatera (TR-2026-0904)',
  },
  {
    movement_id: 905,
    batch_id: 1002,
    batch_number: 'BTH-202607-014',
    product_name: 'Sari Kacang Ijo 250ml',
    uom: 'Karton',
    source_warehouse_id: 2,
    destination_warehouse_id: null,
    source_warehouse_name: 'Surabaya Distribution Hub',
    destination_warehouse_name: 'PT. Sumber Alfaria Trijaya',
    movement_type: 'OUT',
    quantity: 120,
    movement_date: '2026-09-09 11:00',
    created_by: 'Bambang Sudiro (Hub Supervisor SBY)',
    notes: 'Outbound Dispatch GI-2026-0902 (Alokasi FEFO Priority #2)',
  },
  {
    movement_id: 906,
    batch_id: 1004,
    batch_number: 'BTH-202608-019',
    product_name: 'Teh Kotak Jasmine 300ml',
    uom: 'Karton',
    source_warehouse_id: 3,
    destination_warehouse_id: null,
    source_warehouse_name: 'Bandung Regional Depo',
    destination_warehouse_name: 'Karantina / Sampling Lab',
    movement_type: 'ADJUSTMENT',
    quantity: 10,
    movement_date: '2026-09-10 08:00',
    created_by: 'Asep Ridwan (QA Inspector)',
    notes: 'Stock Adjustment untuk Retensi Pengujian Kualitas Berkala',
  },
];

export const MONTHLY_FLOW_DATA: MonthlyFlow[] = [
  { month: 'Jan', incoming: 28000, outgoing: 24000 },
  { month: 'Feb', incoming: 48000, outgoing: 38000 },
  { month: 'Mar', incoming: 38000, outgoing: 32000 },
  { month: 'Apr', incoming: 52000, outgoing: 44000 },
  { month: 'May', incoming: 36000, outgoing: 30000 },
  { month: 'Jun', incoming: 42000, outgoing: 39000 },
  { month: 'Jul', incoming: 46000, outgoing: 42000 },
  { month: 'Aug', incoming: 54000, outgoing: 48000 },
  { month: 'Sep', incoming: 32000, outgoing: 29000 },
];

export const ACTIVITY_LOGS = [
  {
    id: 'act-1',
    user: 'Farid Ghani',
    role: 'Head of Logistics',
    action: 'Menerbitkan Goods Issue GI-2026-0901',
    target: '150 Karton Ultra Milk Cokelat (Batch BTH-202607-001) - FEFO Priority #1',
    time: '5 menit lalu',
    timestamp: '5 menit lalu',
    type: 'order',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'act-2',
    user: 'Siti Rahmawati',
    role: 'QA & Inbound PIC',
    action: 'Mencatat Goods Receipt GR-2026-0901',
    target: '1.500 Karton Ultra Milk Full Cream 1000ml dari Lini Pabrik Tetra Pak A',
    time: '35 menit lalu',
    timestamp: '35 menit lalu',
    type: 'inventory',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'act-3',
    user: 'Bambang Sudiro',
    role: 'Surabaya Hub Supervisor',
    action: 'Konfirmasi Penerimaan Transfer TR-2026-0902',
    target: '200 Karton Ultra Mimi Kids Vanilla dari Gudang Cikarang',
    time: '2 jam lalu',
    timestamp: '2 jam lalu',
    type: 'finance',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces',
  },
];

export const CHART_DATA_WEEKLY = [
  { label: 'Sen', revenue: 42000000, expenses: 28000000, orders: 18, target: 40000000 },
  { label: 'Sel', revenue: 58000000, expenses: 35000000, orders: 24, target: 50000000 },
  { label: 'Rab', revenue: 65000000, expenses: 40000000, orders: 28, target: 60000000 },
  { label: 'Kam', revenue: 84000000, expenses: 52000000, orders: 36, target: 70000000 },
  { label: 'Jum', revenue: 78000000, expenses: 48000000, orders: 32, target: 70000000 },
  { label: 'Sab', revenue: 32000000, expenses: 20000000, orders: 14, target: 30000000 },
  { label: 'Min', revenue: 19000000, expenses: 12000000, orders: 8, target: 20000000 },
];

export const CHART_DATA_MONTHLY = [
  { label: 'Jan', revenue: 1850000000, expenses: 1200000000, orders: 540, target: 1700000000 },
  { label: 'Feb', revenue: 2100000000, expenses: 1400000000, orders: 620, target: 1900000000 },
  { label: 'Mar', revenue: 1980000000, expenses: 1300000000, orders: 580, target: 1950000000 },
  { label: 'Apr', revenue: 2450000000, expenses: 1600000000, orders: 710, target: 2200000000 },
  { label: 'Mei', revenue: 2320000000, expenses: 1500000000, orders: 680, target: 2250000000 },
  { label: 'Jun', revenue: 2680000000, expenses: 1750000000, orders: 790, target: 2500000000 },
  { label: 'Jul', revenue: 2890000000, expenses: 1880000000, orders: 840, target: 2700000000 },
  { label: 'Agu', revenue: 3120000000, expenses: 2020000000, orders: 920, target: 2900000000 },
  { label: 'Sep', revenue: 2750000000, expenses: 1790000000, orders: 810, target: 2800000000 },
];

export const CATEGORY_SHARES = [
  { name: 'Susu UHT & Dairy', value: 48, percentage: 48, color: '#00529b', growth: '+14.2%' },
  { name: 'RTD Tea Beverage', value: 26, percentage: 26, color: '#0084d6', growth: '+8.5%' },
  { name: 'Healthy & Traditional', value: 16, percentage: 16, color: '#10B981', growth: '+5.1%' },
  { name: 'Kids Nutrition', value: 10, percentage: 10, color: '#F59E0B', growth: '+12.4%' },
];

