'use client';

import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES, INVENTORY_FEFO_ITEMS, BATCHES } from '@/data/mockData';
import { Product } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Eye,
  Layers,
  X,
  Database,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [uom, setUom] = useState('Karton (24 pcs)');
  const [description, setDescription] = useState('');
  const [minStock, setMinStock] = useState('500');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category_id.toString() === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Harap lengkapi nama produk.', 'warning');
      return;
    }

    const cat = CATEGORIES.find((c) => c.category_id === Number(categoryId));
    const newProd: Product = {
      product_id: Date.now(),
      category_id: Number(categoryId),
      category_name: cat?.name || 'Kategori',
      sku: sku.trim() ? sku.toUpperCase() : `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name,
      description: description || `Produk berkualitas dari kategori ${cat?.name}`,
      uom,
      min_stock_level: Number(minStock) || 500,
    };

    setProducts([newProd, ...products]);
    showToast(`Produk ${name} (${newProd.sku}) berhasil ditambahkan ke Master Data Products!`, 'success', 'Produk Ditambahkan');
    setIsModalOpen(false);
    setName('');
    setSku('');
    setDescription('');
  };

  // Helper to calculate total stock per product
  const getProductStock = (productId: number) => {
    return INVENTORY_FEFO_ITEMS.filter((i) => i.product_id === productId).reduce((acc, curr) => acc + curr.quantity, 0);
  };

  // Helper to get batches count
  const getProductBatchesCount = (productId: number) => {
    return BATCHES.filter((b) => b.product_id === productId).length;
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">
              <Package size={12} /> MASTER DATA: products & categories
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Master Data Produk & Kategori
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Katalog produk manufaktur PT. Ultra Jaya, satuan kemasan (uom), dan batas minimum stok aman (min_stock_level).
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Tambah Produk Baru
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama produk, SKU..."
            className="input-control"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              border: '1px solid',
              borderColor: selectedCategory === 'all' ? '#00529b' : 'var(--border-subtle)',
              backgroundColor: selectedCategory === 'all' ? 'rgba(0, 82, 155, 0.12)' : 'var(--bg-surface)',
              color: selectedCategory === 'all' ? '#00529b' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Semua Kategori
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setSelectedCategory(cat.category_id.toString())}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid',
                borderColor: selectedCategory === cat.category_id.toString() ? '#00529b' : 'var(--border-subtle)',
                backgroundColor: selectedCategory === cat.category_id.toString() ? 'rgba(0, 82, 155, 0.12)' : 'var(--bg-surface)',
                color: selectedCategory === cat.category_id.toString() ? '#00529b' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filteredProducts.map((prod) => {
          const currentStock = getProductStock(prod.product_id);
          const batchesCount = getProductBatchesCount(prod.product_id);
          const isBelowMin = currentStock < prod.min_stock_level;

          return (
            <div
              key={prod.product_id}
              className="glass-card"
              style={{
                borderRadius: '20px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#0077c8',
                      backgroundColor: 'rgba(0, 119, 200, 0.1)',
                      padding: '3px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    {prod.sku || `ID: ${prod.product_id}`}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                    {prod.category_name || `category_id: ${prod.category_id}`}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '10px' }}>
                  {prod.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {prod.description}
                </p>
              </div>

              {/* Stock info */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Stok Total (inventory)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isBelowMin ? '#EF4444' : 'var(--text-primary)', marginTop: '2px' }}>
                    {currentStock.toLocaleString('id-ID')} {prod.uom.split(' ')[0]}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Jumlah Batch Aktif</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00529b', marginTop: '2px' }}>
                    {batchesCount} Batch
                  </div>
                </div>
              </div>

              {/* Footer details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Satuan: <b>{prod.uom}</b>
                </span>
                <span style={{ color: isBelowMin ? '#EF4444' : 'var(--text-muted)' }}>
                  Min Level: <b>{prod.min_stock_level}</b>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="glass-card"
            style={{
              width: '500px',
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
              <div>
                <span className="badge badge-primary">ERD: products TABLE</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px' }}>Tambah Master Produk</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Nama Produk (name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth: Ultra Milk Low Fat High Calcium 1000ml"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Kategori (category_id) *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="input-control"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Kode SKU
                  </label>
                  <input
                    type="text"
                    placeholder="UM-LF-1000"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Satuan Kemasan (uom) *
                  </label>
                  <input
                    type="text"
                    required
                    value={uom}
                    onChange={(e) => setUom(e.target.value)}
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Batas Minimum Stok (min_stock_level)
                  </label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Deskripsi Produk (description)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan kandungan nutrisi dan spesifikasi kemasan..."
                  className="input-control"
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
