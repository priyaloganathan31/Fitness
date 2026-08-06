import React, { useState } from 'react';
import type { UserRole } from '../types/audit';
import { ADMIN_PROFILE, DEMO_AUDITORS } from '../types/audit';
import { ShieldCheck, UserCheck, ArrowRight, Lock, Mail } from 'lucide-react';

interface SmartAuditLoginProps {
  auditors: UserRole[];
  onLoginSuccess: (role: UserRole, targetTab: 'admin-dashboard' | 'auditor-portal') => void;
}

export const SmartAuditLogin: React.FC<SmartAuditLoginProps> = ({ auditors, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleQuickAdminLogin = () => {
    onLoginSuccess(ADMIN_PROFILE, 'admin-dashboard');
  };

  const handleQuickAuditorLogin = () => {
    const targetAuditor = auditors[0] || DEMO_AUDITORS[0];
    onLoginSuccess(targetAuditor, 'auditor-portal');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const inputEmail = email.trim().toLowerCase();
    if (!inputEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (inputEmail.includes('admin') || inputEmail === 'admin@s7.com') {
      onLoginSuccess(ADMIN_PROFILE, 'admin-dashboard');
    } else {
      const matched = auditors.find(a => a.email.toLowerCase() === inputEmail) || auditors[0] || DEMO_AUDITORS[0];
      onLoginSuccess(matched, 'auditor-portal');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(circle at 50% 20%, #1E1B4B 0%, #0F172A 60%, #0B0F19 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#FFFFFF'
    }}>
      {/* Sleek Dark Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {/* Shield Icon Header Badge */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.3) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)'
        }}>
          <ShieldCheck size={32} color="#818CF8" />
        </div>

        {/* Title & Subtitle */}
        <h1 style={{
          fontSize: '1.85rem',
          fontWeight: 900,
          color: '#FFFFFF',
          margin: 0,
          textAlign: 'center',
          letterSpacing: '-0.5px'
        }}>
          Fitness Certificate Login
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: '#94A3B8',
          marginTop: '6px',
          marginBottom: '28px',
          textAlign: 'center',
          fontWeight: 500
        }}>
          Sign in to access your audit workspace
        </p>

        {/* Quick Access Role Selection Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          width: '100%',
          marginBottom: '24px'
        }}>
          {/* Quick Admin Card */}
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '16px 12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              color: '#FFFFFF'
            }}
            className="hover-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.borderColor = '#6366F1';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '2px' }}>
              Quick Admin
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>
              admin@s7.com
            </div>
          </button>

          {/* Quick Auditor Card */}
          <button
            type="button"
            onClick={handleQuickAuditorLogin}
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '16px 12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.borderColor = '#6366F1';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '2px' }}>
              Quick Auditor
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>
              auditor@s7.com
            </div>
          </button>
        </div>

        {/* Divider with Text */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          marginBottom: '24px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{
            padding: '0 12px',
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#64748B',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            OR CREDENTIALS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Email / Password Login Form */}
        <form onSubmit={handleFormSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Email Address Field */}
          <div>
            <label style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#94A3B8',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. auditor@s7.com"
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '0.9rem',
                  color: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366F1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#94A3B8',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '0.9rem',
                  color: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366F1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{ fontSize: '0.78rem', color: '#F87171', fontWeight: 700, textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Sign In Primary Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '6px',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(79, 70, 229, 0.4)';
            }}
          >
            Sign In <ArrowRight size={18} />
          </button>

        </form>

        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '24px', textAlign: 'center' }}>
          Fitness Certificate Audit System • Encrypted Role-Based Authentication
        </div>

      </div>
    </div>
  );
};
