import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Report_Issue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'infrastructure', label: '🏗️ Infrastructure' },
    { value: 'sanitation', label: '🧹 Sanitation' },
    { value: 'water_supply', label: '💧 Water Supply' },
    { value: 'electricity', label: '⚡ Electricity' },
    { value: 'roads', label: '🛣️ Roads' },
    { value: 'waste_management', label: '🗑️ Waste Management' },
    { value: 'safety', label: '🛡️ Safety' },
    { value: 'other', label: '📋 Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        address: ''
      });
      
      alert('Issue reported successfully! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
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
          Report an Issue
        </h1>
        <p style={{ 
          fontSize: '1.1rem',
          color: '#7f8c8d',
          margin: 0
        }}>
          Help improve your community by reporting civic issues
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef'
      }}>
        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#495057',
            marginBottom: '8px'
          }}>
            Issue Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.title ? '2px solid #dc3545' : '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Brief description of the issue"
          />
          {errors.title && (
            <p style={{ 
              color: '#dc3545',
              fontSize: '14px',
              margin: '5px 0 0 0'
            }}>
              ⚠️ {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#495057',
            marginBottom: '8px'
          }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.description ? '2px solid #dc3545' : '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
            placeholder="Detailed description of the issue, including any relevant information"
          />
          {errors.description && (
            <p style={{ 
              color: '#dc3545',
              fontSize: '14px',
              margin: '5px 0 0 0'
            }}>
              ⚠️ {errors.description}
            </p>
          )}
        </div>

        {/* Category and Priority */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#495057',
              marginBottom: '8px'
            }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.category ? '2px solid #dc3545' : '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p style={{ 
                color: '#dc3545',
                fontSize: '14px',
                margin: '5px 0 0 0'
              }}>
                ⚠️ {errors.category}
              </p>
            )}
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#495057',
              marginBottom: '8px'
            }}>
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#495057',
            marginBottom: '8px'
          }}>
            📍 Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.address ? '2px solid #dc3545' : '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter the address where the issue is located"
          />
          {errors.address && (
            <p style={{ 
              color: '#dc3545',
              fontSize: '14px',
              margin: '5px 0 0 0'
            }}>
              ⚠️ {errors.address}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'right' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: isSubmitting ? '#6c757d' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: 'auto'
            }}
          >
            {isSubmitting ? (
              <>
                <span>⏳</span> Submitting...
              </>
            ) : (
              <>
                <span>📤</span> Submit Issue
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Report_Issue;
