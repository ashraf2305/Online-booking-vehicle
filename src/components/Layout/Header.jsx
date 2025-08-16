import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Header() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('auth');
    // Clear session state
    dispatch({ type: 'LOGOUT' });
    // Force page reload to clear any cached state
    window.location.reload();
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN':
      case 'admin': return 'Administrator';
      case 'BRANCH_ADMIN':
      case 'branch-admin': return 'Branch Admin';
      case 'CUSTOMER':
      case 'customer': return 'Customer';
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">
                  Vehicle Booking System
                </h1>
              </div>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {currentUser.userId}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getRoleDisplayName(currentUser.role)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}