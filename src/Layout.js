import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: "🏠",
  },
  {
    title: "Report Issue",
    url: createPageUrl("ReportIssue"),
    icon: "➕",
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: "📊",
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
      color: theme === 'dark' ? '#ffffff' : '#2c3e50'
    }}>
      {/* Mobile menu button */}
      <button
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 50,
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: 'white',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: window.innerWidth < 768 ? 'block' : 'none'
        }}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? '0' : '-256px',
        width: '256px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        zIndex: 40,
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          borderBottom: '1px solid #e9ecef',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3498db, #27ae60)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🛡️
            </div>
            <div>
              <h2 style={{ 
                margin: 0,
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#2c3e50'
              }}>SheharFix</h2>
              <p style={{ 
                margin: 0,
                fontSize: '14px',
                color: '#7f8c8d'
              }}>Issue Reporting System</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div style={{ flex: 1, padding: '16px' }}>
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#7f8c8d',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '8px 12px',
              margin: 0
            }}>
              Navigation
            </h3>
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  fontWeight: '500',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: location.pathname === item.url ? '#3498db' : '#6c757d',
                  backgroundColor: location.pathname === item.url ? '#e3f2fd' : 'transparent',
                  marginBottom: '4px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSidebarOpen(false)}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.url) {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.color = '#3498db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.url) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6c757d';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>

          {/* Community Stats */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#7f8c8d',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '8px 12px',
              margin: 0
            }}>
              Community
            </h3>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                marginBottom: '12px'
              }}>
                <span>👥</span>
                <span style={{ color: '#6c757d' }}>Active Citizens</span>
                <span style={{ 
                  marginLeft: 'auto',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>1,247</span>
              </div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}>
                <span>🛡️</span>
                <span style={{ color: '#6c757d' }}>Issues Resolved</span>
                <span style={{ 
                  marginLeft: 'auto',
                  fontWeight: '600',
                  color: '#27ae60'
                }}>89%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e9ecef',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #3498db, #27ae60)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                C
              </div>
              <span style={{
                fontWeight: '500',
                fontSize: '14px',
                color: '#2c3e50'
              }}>Citizen</span>
            </div>
            <button 
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={toggleTheme}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: window.innerWidth >= 768 ? '256px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Mobile header */}
        <header style={{
          display: window.innerWidth < 768 ? 'block' : 'none',
          backgroundColor: 'white',
          borderBottom: '1px solid #e9ecef',
          padding: '16px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>SheharFix</h1>
            <button 
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={toggleTheme}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 30,
            display: window.innerWidth < 768 ? 'block' : 'none'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
