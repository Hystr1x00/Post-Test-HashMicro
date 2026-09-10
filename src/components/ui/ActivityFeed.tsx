'use client';

import React from 'react';
import { ACTIVITY_LOGS } from '@/data/mockData';
import { Activity, ShieldCheck, ShoppingCart, Box, DollarSign, UserCheck } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={13} color="#10b981" />;
      case 'inventory':
        return <Box size={13} color="#f59e0b" />;
      case 'finance':
        return <DollarSign size={13} color="#3b82f6" />;
      case 'security':
        return <ShieldCheck size={13} color="#8b5cf6" />;
      default:
        return <UserCheck size={13} color="#ec4899" />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Log Aktivitas & Audit Trail
            </h3>
            <span className="badge badge-neutral">
              <Activity size={12} /> Realtime
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Aktivitas terbaru tim manajemen, approval, dan automated bot
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {ACTIVITY_LOGS.map((item, idx) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {/* Avatar with icon badge */}
            <div style={{ position: 'relative' }}>
              <img
                src={item.avatar}
                alt={item.user}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getBadgeIcon(item.type)}
              </div>
            </div>

            {/* Description */}
            <div style={{ flex: 1, minWidth: 0, fontSize: '0.8125rem' }}>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.user}</span>{' '}
                <span style={{ color: 'var(--text-muted)' }}>({item.role})</span>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{item.action}</span>{' '}
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.target}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                {item.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
