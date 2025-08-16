import React, { useState, useEffect } from 'react';
import { Car, Users, FileText, Plus, Building, Edit } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleRequestForm } from './VehicleRequestForm';
import { ProfileSetupForm } from './ProfileSetupForm';
import { bookingApi } from '../../api/bookingApi';
import { vehicleApi } from '../../api/vehicleApi';
import { userApi } from '../../api/userApi.jsx';

export function BranchDashboard() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  const currentUser = state.currentUser;
  const branchProfile = currentUser?.profile || currentUser;
  
  // Check if profile setup is needed
  const needsProfileSetup = !branchProfile?.branchName;

  // Get branch-specific data
  const branchRequests = state.vehicleRequests.filter(r => r.branchId === currentUser.id);
  const allBranchBookings = state.bookings.filter(b => b.branchId === currentUser.id);
  // Pending bookings are those that need approval
  const pendingBookings = allBranchBookings.filter(b => b.status.toLowerCase() === 'pending');
  // Total bookings should only include approved bookings
  const branchBookings = allBranchBookings.filter(b => b.status.toLowerCase() === 'approved');

  useEffect(() => {
    if (needsProfileSetup) {
      setShowProfileForm(true);
    }
  }, [needsProfileSetup]);

  // Load bookings for this branch
  useEffect(() => {
    if (currentUser?.id && state.authToken) {
      const loadBookings = async () => {
        try {
          const bookings = await bookingApi.byBranch(currentUser.id, state.authToken);
          console.log('Loaded branch bookings:', bookings);
          dispatch({ type: 'SET_BOOKINGS', payload: bookings });
        } catch (error) {
          console.error('Error loading bookings:', error);
        }
      };
      loadBookings();
    }
  }, [currentUser?.id, state.authToken]);

  const handleBookingApproval = async (bookingId, status, notes = '') => {
    try {
      const booking = state.bookings.find(b => b.id === bookingId);
      if (!booking || !state.authToken) {
        console.error('Missing booking or auth token');
        return;
      }

      console.log('Processing booking approval:', bookingId, status);
      
      // Get current vehicle data first
      const currentVehicle = await vehicleApi.getById(booking.vehicleId, state.authToken);
      console.log('Current vehicle data:', currentVehicle);
      
      if (status === 'approved' && currentVehicle.availability <= 0) {
        throw new Error('Vehicle is not available for booking');
      }

      // Prepare a simple body with only the necessary fields
      const body = { 
        branchAdminNotes: notes,
        vehicleId: booking.vehicleId,
        updateAvailability: true
      };

      let updated;
      try {
        if (status === 'approved') {
          // Approve the booking with update availability flag
          updated = await bookingApi.approve(bookingId, body, state.authToken);
          console.log('Booking approved:', updated);
        } else {
          // Reject the booking with update availability flag
          updated = await bookingApi.reject(bookingId, body, state.authToken);
          console.log('Booking rejected:', updated);
        }

        // Update booking in local state
        dispatch({
          type: 'UPDATE_BOOKING',
          payload: {
            ...booking,
            ...updated,
            status: status.toLowerCase(),
            vehicleId: booking.vehicleId
          }
        });

        // Refresh vehicle list to get updated availability
        const updatedVehicles = await vehicleApi.list(state.authToken);
        console.log('Updated vehicles:', updatedVehicles);
        dispatch({ type: 'SET_VEHICLES', payload: updatedVehicles });

        console.log('Booking and vehicles updated successfully');
      } catch (apiError) {
        console.error('API error:', apiError);
        throw new Error(apiError.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(error.message || 'Failed to update booking status. Please try again.');
    }
  };

  const stats = [
    {
      name: 'Vehicle Requests',
      value: branchRequests.length,
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      name: 'Pending Approvals',
      value: pendingBookings.length,
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      name: 'Approved Bookings',
      value: branchBookings.length,
      icon: FileText,
      color: 'bg-emerald-500'
    }
  ];

  if (needsProfileSetup && showProfileForm) {
    return (
      <ProfileSetupForm
        onSave={async (profile) => {
          try {
            const updatedProfile = await userApi.updateProfile(currentUser.id, profile, state.authToken);
            const updatedUser = {
              ...currentUser,
              id: currentUser.id,
              profile: updatedProfile,
              branchName: updatedProfile.branchName,
              branchCode: updatedProfile.branchCode,
              address: updatedProfile.address,
              phone: updatedProfile.phone,
              email: updatedProfile.email,
              managerName: updatedProfile.managerName
            };
            dispatch({
              type: 'UPDATE_USER',
              payload: updatedUser
            });
            setShowProfileForm(false);
          } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
          }
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branch Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              {branchProfile?.branchName} - {branchProfile?.branchCode}
            </p>
          </div>
          <button
            onClick={() => setShowProfileForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'requests', name: 'Vehicle Requests' },
            { id: 'bookings', name: 'Customer Bookings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Branch Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Building className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Branch Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Branch Name</p>
                <p className="font-medium text-gray-900">{branchProfile?.branchName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Branch Code</p>
                <p className="font-medium text-gray-900">{branchProfile?.branchCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Manager</p>
                <p className="font-medium text-gray-900">{branchProfile?.managerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-medium text-gray-900">{branchProfile?.phone}</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {pendingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-sm text-gray-600">Booked {booking.vehicleName}</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    Pending Approval
                  </span>
                </div>
              ))}
              {pendingBookings.length === 0 && (
                <p className="text-gray-500 text-center">No pending bookings</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Requests</h2>
            <button
              onClick={() => setShowRequestForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Request Vehicles</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Vehicle Requests Status</h2>
              <p className="text-sm text-gray-600 mt-1">Track your vehicle requests and their approval status</p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {branchRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.vehicleName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.requestedQuantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.approvedQuantity || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        request.status === 'partially-approved' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs">
                      <div className="truncate" title={request.adminNotes}>
                        {request.adminNotes || 'No notes'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {branchRequests.length === 0 && (
              <div className="text-center py-8">
                <div className="flex flex-col items-center">
                  <Car className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No vehicle requests yet</p>
                  <p className="text-gray-400 text-sm">Click "Request Vehicles" to make your first request</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Customer Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allBranchBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerName && booking.customerName !== booking.customerId 
                          ? booking.customerName 
                          : 'Customer Name Not Set'}
                      </div>
                      {booking.customerId && (
                        <div className="text-xs text-gray-500">ID: {booking.customerId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.vehicleName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${booking.totalAmount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        booking.status === 'in-process' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status.toLowerCase() === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleBookingApproval(booking.id, 'approved')}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleBookingApproval(booking.id, 'rejected')}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {branchBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No customer bookings yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vehicle Request Form Modal */}
      {showRequestForm && (
        <VehicleRequestForm
          branchId={currentUser.id}
          branchName={branchProfile?.branchName || ''}
          onClose={() => setShowRequestForm(false)}
          onSubmit={(request) => {
            dispatch({ type: 'ADD_VEHICLE_REQUEST', payload: request });
            setShowRequestForm(false);
          }}
        />
      )}

      {/* Profile Setup Form Modal */}
      {showProfileForm && !needsProfileSetup && (
        <ProfileSetupForm
          initialProfile={branchProfile}
          onSave={async (profile) => {
            try {
              const updatedProfile = await userApi.updateProfile(currentUser.id, profile, state.authToken);
              console.log('Received updated profile:', updatedProfile);
              
              // Create updated user with profile data
              const updatedUser = {
                ...currentUser,
                id: currentUser.id,
                profile: updatedProfile,
                // Also update root-level fields
                managerName: updatedProfile.managerName,
                branchName: updatedProfile.branchName,
                branchCode: updatedProfile.branchCode,
                address: updatedProfile.address,
                phone: updatedProfile.phone,
                email: updatedProfile.email
              };
              
              dispatch({
                type: 'UPDATE_USER',
                payload: updatedUser
              });
              
              setShowProfileForm(false);
            } catch (error) {
              console.error('Error updating profile:', error);
              alert('Failed to update profile. Please try again.');
            }
          }}
          onCancel={() => setShowProfileForm(false)}
        />
      )}
    </div>
  );
}
