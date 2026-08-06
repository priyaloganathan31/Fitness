import React from 'react';
import { Smartphone, Monitor, Signal, Wifi, Battery } from 'lucide-react';

interface MobileFrameWrapperProps {
  viewMode: 'DESKTOP' | 'MOBILE';
  onToggleViewMode: (mode: 'DESKTOP' | 'MOBILE') => void;
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  viewMode,
  onToggleViewMode,
  children
}) => {
  if (viewMode === 'DESKTOP') {
    return <>{children}</>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 10px' }}>
      
      {/* Device Viewport Selector Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFFFF', padding: '6px 16px', borderRadius: '30px', border: '1px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 1000 }}>
        <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700 }}>Active Viewport:</span>
        
        <button
          onClick={() => onToggleViewMode('DESKTOP')}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: 'none',
            background: 'transparent',
            color: '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Monitor size={14} /> Desktop Web View
        </button>

        <button
          onClick={() => onToggleViewMode('MOBILE')}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: 'none',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Smartphone size={14} /> Mobile App View
        </button>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div
        style={{
          width: '390px',
          height: '844px',
          background: '#F8FAFC',
          borderRadius: '48px',
          border: '12px solid #0F172A',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255,255,255,0.5)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Dynamic Island / Notch */}
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '110px', height: '24px', background: '#000000', borderRadius: '20px', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1E293B', border: '1px solid #334155' }} />
        </div>

        {/* Mobile Status Bar */}
        <div style={{ height: '44px', background: '#0F172A', padding: '12px 24px 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF', zIndex: 9998, userSelect: 'none' }}>
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={12} color="#FFFFFF" />
            <Wifi size={12} color="#FFFFFF" />
            <Battery size={14} color="#34D399" />
          </div>
        </div>

        {/* Inner Mobile Scroll View */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '20px', background: '#F1F5F9' }}>
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div style={{ height: '24px', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}>
          <div style={{ width: '130px', height: '4px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '2px' }} />
        </div>
      </div>

    </div>
  );
};
