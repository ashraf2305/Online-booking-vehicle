import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Layout/Header';
import { Login } from './components/Auth/Login';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { BranchDashboard } from './components/BranchAdmin/BranchDashboard';
import { CustomerDashboard } from './components/Customer/CustomerDashboard';

function AppContent() {
  const { state } = useApp();
  const { currentUser } = state;

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {currentUser.role === 'admin' && <AdminDashboard />}
        {currentUser.role === 'branch-admin' && <BranchDashboard />}
        {currentUser.role === 'customer' && <CustomerDashboard />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;