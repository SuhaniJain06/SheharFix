import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Pages/Dashboard';
import ReportIssue from './Pages/Report_Issue';
import Analytics from './Pages/Analytics';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
