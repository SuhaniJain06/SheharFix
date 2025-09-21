// Utility functions for the application

export const createPageUrl = (pageName) => {
  const routes = {
    Dashboard: '/dashboard',
    ReportIssue: '/report-issue',
    Analytics: '/analytics'
  };
  return routes[pageName] || '/';
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const getStatusColor = (status) => {
  const colors = {
    reported: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-orange-100 text-orange-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

export const getCategoryIcon = (category) => {
  const icons = {
    infrastructure: '🏗️',
    sanitation: '🧹',
    water_supply: '💧',
    electricity: '⚡',
    roads: '🛣️',
    public_transport: '🚌',
    waste_management: '🗑️',
    safety: '🛡️',
    environment: '🌱',
    healthcare: '🏥',
    education: '📚',
    other: '📋'
  };
  return icons[category] || '📋';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
