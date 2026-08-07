import React, { Component, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  public handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#EF4444', marginBottom: '8px' }}>
              ⚠️ Application State Notice
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '20px', lineHeight: '1.5' }}>
              {this.state.error?.message || 'A temporary browser cache error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              style={{ padding: '12px 24px', borderRadius: '10px', background: '#2563EB', color: '#FFFFFF', border: 'none', fontSize: '0.9rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
            >
              🔄 Reset Cache & Load Fresh App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
