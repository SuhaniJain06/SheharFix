import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewAllIssues = () => {
    // For now, show an alert. Later this could navigate to an issues list page
    alert('View All Issues - This would show a list of all reported issues');
  };

  const handleReportIssue = () => {
    navigate('/report-issue');
  };

  const handleViewMyIssues = () => {
    // For now, show an alert. Later this could navigate to user's issues page
    alert('View My Issues - This would show your reported issues');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: '10px'
        }}>
          SheharFix Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.1rem',
          color: '#7f8c8d',
          margin: 0
        }}>
          Welcome to SheharFix - Your Civic Issue Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Total Issues</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>1,247</p>
            </div>
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '15px',
              borderRadius: '10px'
            }}>
              📍
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Resolved</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>892</p>
            </div>
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '15px',
              borderRadius: '10px'
            }}>
              ✅
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>In Progress</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>234</p>
            </div>
            <div style={{
              backgroundColor: '#fef9e7',
              padding: '15px',
              borderRadius: '10px'
            }}>
              ⏰
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Pending</p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>121</p>
            </div>
            <div style={{
              backgroundColor: '#fdeaea',
              padding: '15px',
              borderRadius: '10px'
            }}>
              ⚠️
            </div>
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '25px',
          borderBottom: '1px solid #e9ecef'
        }}>
          <h2 style={{ 
            margin: '0 0 10px 0',
            fontSize: '1.5rem',
            color: '#2c3e50'
          }}>Recent Issues</h2>
          <p style={{ margin: 0, color: '#6c757d' }}>Latest civic issues reported by citizens</p>
        </div>

        <div>
          <div style={{
            padding: '20px 25px',
            borderBottom: '1px solid #f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ fontSize: '24px' }}>🏗️</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '16px' }}>Broken Street Light</h3>
                <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Main Street, Ward 5</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>in progress</span>
                  <span style={{
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>medium</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '14px' }}>
              <p style={{ margin: '0 0 5px 0' }}>by John Doe</p>
              <p style={{ margin: 0 }}>2 hours ago</p>
            </div>
          </div>

          <div style={{
            padding: '20px 25px',
            borderBottom: '1px solid #f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ fontSize: '24px' }}>🗑️</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '16px' }}>Garbage Collection Issue</h3>
                <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Residential Area, Ward 3</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{
                    backgroundColor: '#cce5ff',
                    color: '#004085',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>reported</span>
                  <span style={{
                    backgroundColor: '#ffeaa7',
                    color: '#d63031',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>high</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '14px' }}>
              <p style={{ margin: '0 0 5px 0' }}>by Jane Smith</p>
              <p style={{ margin: 0 }}>4 hours ago</p>
            </div>
          </div>

          <div style={{
            padding: '20px 25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ fontSize: '24px' }}>💧</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '16px' }}>Water Supply Problem</h3>
                <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Apartment Complex, Ward 7</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>resolved</span>
                  <span style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>critical</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', color: '#6c757d', fontSize: '14px' }}>
              <p style={{ margin: '0 0 5px 0' }}>by Mike Johnson</p>
              <p style={{ margin: 0 }}>1 day ago</p>
            </div>
          </div>
        </div>

        <div style={{
          padding: '25px',
          borderTop: '1px solid #e9ecef'
        }}>
          <button 
            onClick={handleViewAllIssues}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            View All Issues
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3498db, #2980b9)',
          color: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem' }}>Report New Issue</h3>
          <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>Found a civic problem? Report it quickly and easily.</p>
          <button 
            onClick={handleReportIssue}
            style={{
              backgroundColor: 'white',
              color: '#3498db',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Report Issue
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #27ae60, #229954)',
          color: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem' }}>Track Progress</h3>
          <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>Monitor the status of your reported issues.</p>
          <button 
            onClick={handleViewMyIssues}
            style={{
              backgroundColor: 'white',
              color: '#27ae60',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            View My Issues
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
          color: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(155, 89, 182, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem' }}>Community Insights</h3>
          <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>View analytics and community engagement data.</p>
          <button 
            onClick={handleViewAnalytics}
            style={{
              backgroundColor: 'white',
              color: '#9b59b6',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
