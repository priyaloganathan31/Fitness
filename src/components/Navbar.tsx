import React, { useState, useEffect } from 'react';
import type { UserRole } from '../types/audit';
import { ShieldCheck, LogOut, Database, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkApiHealth } from '../utils/api';
import { seedCurrentDataToMongoDB } from '../utils/storage';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  flaggedReviewCount: number;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  flaggedReviewCount,
  onSignOut
}) => {
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Checking MongoDB status...'
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const verifyBackendDb = async () => {
    const health = await checkApiHealth();
    setDbStatus({
      connected: health.connected,
      message: health.message
    });
  };

  useEffect(() => {
    verifyBackendDb();
    const timer = setInterval(verifyBackendDb, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleSyncToMongo = async () => {
    setIsSyncing(true);
    setSyncNotice(null);
    try {
      const res = await seedCurrentDataToMongoDB();
      if (res.success) {
        setSyncNotice('✅ Data synced to MongoDB!');
        setDbStatus({ connected: true, message: 'Connected to MongoDB' });
      } else {
        setSyncNotice(`⚠️ ${res.message}`);
      }
    } catch (e: any) {
      setSyncNotice(`❌ ${e.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderBottom: '1px solid #334155', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)' }}>
            <ShieldCheck size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>FC SMART AUDIT</span>
              <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 6px', borderRadius: '4px', border: '1px solid #10B981', fontFamily: 'monospace', fontWeight: 800 }}>
                COLLEGE
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
              Campus Audits • Medical Center & FM Radio Station
            </div>
          </div>
        </div>

        {/* Strict Active Workspace Badge & MongoDB Backend Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {activeRole.roleType === 'ADMIN' ? (
            <div style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: '#FFFFFF', padding: '6px 16px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}>
              <span>🏛️ ADMIN WORKSPACE</span>
              {flaggedReviewCount > 0 && (
                <span style={{ background: '#EF4444', color: '#FFFFFF', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 900 }}>
                  {flaggedReviewCount} Review Actions
                </span>
              )}
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#FFFFFF', padding: '6px 16px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)' }}>
              <span>📋 AUDITOR WORKSPACE</span>
              <span style={{ background: 'rgba(255, 255, 255, 0.2)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                {activeRole.name}
              </span>
            </div>
          )}

          {/* MongoDB Backend Status Badge */}
          <div
            title={dbStatus.message}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: dbStatus.connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${dbStatus.connected ? '#10B981' : '#F59E0B'}`,
              color: dbStatus.connected ? '#34D399' : '#FBBF24'
            }}
          >
            <Database size={14} />
            <span>{dbStatus.connected ? 'MongoDB Connected' : 'Local Mode'}</span>
            {dbStatus.connected ? <CheckCircle2 size={13} color="#34D399" /> : <AlertCircle size={13} color="#FBBF24" />}
          </div>

          {/* Seed/Sync to MongoDB button */}
          <button
            onClick={handleSyncToMongo}
            disabled={isSyncing}
            title="Populate or sync current dataset to MongoDB"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #3B82F6',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: isSyncing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync DB'}</span>
          </button>

          {syncNotice && (
            <span style={{ fontSize: '0.72rem', color: '#60A5FA', fontWeight: 800, padding: '2px 6px' }}>
              {syncNotice}
            </span>
          )}
        </div>

        {/* User Actions & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Sign Out Button */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out / Return to Login Screen"
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
              }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
