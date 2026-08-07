import React from 'react';
import type { UserRole } from '../types/audit';
import { ADMIN_PROFILE, DEMO_AUDITORS } from '../types/audit';
import { ShieldCheck, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  flaggedReviewCount: number;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  flaggedReviewCount,
  onSignOut
}) => {
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

        {/* Strict Active Workspace Badge Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
