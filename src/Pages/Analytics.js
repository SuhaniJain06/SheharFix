import React from 'react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  
  const stats = [
    { title: 'Total Issues', value: '1,247', change: '+12%', icon: '📊', color: '#3498db' },
    { title: 'Resolution Rate', value: '89%', change: '+5%', icon: '✅', color: '#27ae60' },
    { title: 'Avg. Resolution Time', value: '3.2 days', change: '-0.5 days', icon: '⏰', color: '#f39c12' },
    { title: 'Active Citizens', value: '892', change: '+23%', icon: '👥', color: '#9b59b6' }
  ];

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
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500',
              marginBottom: '10px'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: '10px'
        }}>
          Analytics Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.1rem',
          color: '#7f8c8d',
          margin: 0
        }}>
          Insights and trends for civic issue management
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>{stat.title}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{stat.value}</p>
                <p style={{ 
                  margin: 0,
                  fontSize: '14px',
                  color: stat.change.startsWith('+') ? '#27ae60' : '#e74c3c'
                }}>
                  📈 {stat.change}
                </p>
              </div>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '10px',
                fontSize: '24px'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Distribution */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0',
          fontSize: '1.5rem',
          color: '#2c3e50'
        }}>Issues by Category</h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {[
            { category: 'Infrastructure', count: 342, percentage: 27.4, color: '#3498db' },
            { category: 'Sanitation', count: 298, percentage: 23.9, color: '#27ae60' },
            { category: 'Water Supply', count: 156, percentage: 12.5, color: '#17a2b8' },
            { category: 'Roads', count: 134, percentage: 10.7, color: '#fd7e14' },
            { category: 'Electricity', count: 98, percentage: 7.9, color: '#ffc107' },
            { category: 'Waste Management', count: 87, percentage: 7.0, color: '#dc3545' }
          ].map((item, index) => (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#495057' }}>{item.category}</span>
                <span style={{ fontSize: '14px', color: '#6c757d' }}>{item.count} ({item.percentage}%)</span>
              </div>
              <div style={{ 
                width: '100%',
                backgroundColor: '#e9ecef',
                borderRadius: '10px',
                height: '8px'
              }}>
                <div 
                  style={{ 
                    height: '8px',
                    borderRadius: '10px',
                    backgroundColor: item.color,
                    width: `${item.percentage}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Performance */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0',
          fontSize: '1.5rem',
          color: '#2c3e50'
        }}>Ward Performance</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#495057', fontSize: '14px', fontWeight: '600' }}>Ward</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#495057', fontSize: '14px', fontWeight: '600' }}>Total Issues</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#495057', fontSize: '14px', fontWeight: '600' }}>Resolved</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#495057', fontSize: '14px', fontWeight: '600' }}>Resolution Rate</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#495057', fontSize: '14px', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ward: 'Ward 5', issues: 234, resolved: 198, rate: 84.6 },
                { ward: 'Ward 3', issues: 198, resolved: 167, rate: 84.3 },
                { ward: 'Ward 7', issues: 187, resolved: 156, rate: 83.4 },
                { ward: 'Ward 2', issues: 156, resolved: 134, rate: 85.9 },
                { ward: 'Ward 8', issues: 134, resolved: 112, rate: 83.6 }
              ].map((ward, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: '#2c3e50' }}>{ward.ward}</td>
                  <td style={{ padding: '12px', color: '#6c757d' }}>{ward.issues}</td>
                  <td style={{ padding: '12px', color: '#6c757d' }}>{ward.resolved}</td>
                  <td style={{ padding: '12px', color: '#6c757d' }}>{ward.rate}%</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: ward.rate >= 85 ? '#d4edda' : ward.rate >= 80 ? '#fff3cd' : '#f8d7da',
                      color: ward.rate >= 85 ? '#155724' : ward.rate >= 80 ? '#856404' : '#721c24'
                    }}>
                      {ward.rate >= 85 ? 'Excellent' : ward.rate >= 80 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0',
          fontSize: '1.5rem',
          color: '#2c3e50'
        }}>Recent Activity</h2>
        
        <div>
          {[
            { action: 'New issue reported', details: 'Broken street light on Main Street', time: '2 minutes ago', type: 'report' },
            { action: 'Issue resolved', details: 'Water supply problem in Ward 5', time: '15 minutes ago', type: 'resolve' },
            { action: 'Progress update', details: 'Road repair work started', time: '1 hour ago', type: 'update' },
            { action: 'New issue reported', details: 'Garbage collection issue', time: '2 hours ago', type: 'report' },
            { action: 'Issue assigned', details: 'Electricity problem assigned to official', time: '3 hours ago', type: 'assign' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activity.type === 'report' ? '#3498db' :
                                activity.type === 'resolve' ? '#27ae60' :
                                activity.type === 'update' ? '#f39c12' : '#9b59b6'
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '500', color: '#2c3e50' }}>{activity.action}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>{activity.details}</p>
              </div>
              <span style={{ fontSize: '12px', color: '#adb5bd' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
